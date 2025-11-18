import { randomBytes } from 'node:crypto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import type { SignOptions } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';
import { Resend } from 'resend';
import type { Repository } from 'typeorm';
import { AuthConfig } from '../config/auth.config';
import type { EmailVerifyDto } from './dto/email-verify.dto';
import type { LoginDto } from './dto/login.dto';
import type { LogoutDto } from './dto/logout.dto';
import type { PasswordResetConfirmDto } from './dto/password-reset-confirm.dto';
import type { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import type { RefreshDto } from './dto/refresh.dto';
import type { RegisterDto } from './dto/register.dto';
import type { VerifyDto } from './dto/verify.dto';
import {
	Confirmation,
	ConfirmationType,
} from './entities/confirmation.entity';
import { PendingUser } from './entities/pending-user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { User } from './entities/user.entity';
import type { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private resend: Resend;

  constructor(
    @InjectRepository(User)
    private _userRepository: Repository<User>,
    @InjectRepository(PendingUser)
    private _pendingUserRepository: Repository<PendingUser>,
    @InjectRepository(RefreshToken)
    private _refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(Confirmation)
    private _confirmationRepository: Repository<Confirmation>,
    private readonly authConfig: AuthConfig,
  ) {
    this.resend = new Resend(this.authConfig.resendApiKey);
  }

  async register(registerDto: RegisterDto) {
    const { username, email, password } = registerDto;

    // Check if user already exists
    const existingUser = await this._userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('This email is already registered');
    }

    try {
      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Hash password
      const hash = await this.hashPassword(password);

      // Save or update pending user
      await this._pendingUserRepository.upsert(
        {
          username,
          email,
          password: hash,
          otp,
        },
        ['email'],
      );

      // Send email
      await this.sendEmail(
        email,
        'Your Confirmation Code',
        `Your confirmation code is ${otp}`,
      );

      return {
        success: true,
        info: 'Confirmation code sent to your email.',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async verify(verifyDto: VerifyDto) {
    const { email, otp } = verifyDto;

    // Find pending user
    const pending = await this._pendingUserRepository.findOne({
      where: { email, otp },
    });
    if (!pending) {
      throw new BadRequestException(
        'Invalid confirmation code or email',
      );
    }

    // Check if user already exists
    const existingUser = await this._userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('This email is already registered');
    }

    try {
      // Create user
      const newUser = this._userRepository.create({
        username: pending.username,
        email: pending.email,
        password: pending.password,
      });
      const savedUser = await this._userRepository.save(newUser);

      // Delete pending user
      await this._pendingUserRepository.delete({ email });

      // Generate tokens
      const { accessToken, refreshToken } = await this.generateTokens(
        savedUser.id,
      );

      // Save refresh token
      const refreshTokenEntity = this._refreshTokenRepository.create({
        token: refreshToken,
        userId: savedUser.id,
      });
      await this._refreshTokenRepository.save(refreshTokenEntity);

      return {
        success: true,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this._userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    // Verify password
    const isMatch = await this.verifyPassword(user.password, password);
    if (!isMatch) {
      throw new BadRequestException('Invalid email or password');
    }

    try {
      // Generate tokens
      const { accessToken, refreshToken } = await this.generateTokens(user.id);

      // Save refresh token
      const refreshTokenEntity = this._refreshTokenRepository.create({
        token: refreshToken,
        userId: user.id,
      });
      await this._refreshTokenRepository.save(refreshTokenEntity);

      return {
        success: true,
        accessToken,
        refreshToken,
      };
    } catch (_error) {
      throw new InternalServerErrorException();
    }
  }

  async requestPasswordReset(
    passwordResetRequestDto: PasswordResetRequestDto,
  ) {
    const { email } = passwordResetRequestDto;

    // Find user
    const user = await this._userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    try {
      // Generate confirmation code
      const confirmationCode = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();

      // Delete any existing password reset confirmations for this user
      await this._confirmationRepository.delete({
        userId: user.id,
        type: ConfirmationType.PASSWORD_RESET,
      });

      // Create confirmation entity
      const confirmation = this._confirmationRepository.create({
        userId: user.id,
        type: ConfirmationType.PASSWORD_RESET,
        code: confirmationCode,
      });
      await this._confirmationRepository.save(confirmation);

      // Send email
      await this.sendEmail(
        email,
        'Confirmation Code',
        `Your confirmation code is ${confirmationCode}`,
      );

      return {
        success: true,
        info: 'Confirmation code has been sent to your email.',
      };
    } catch (_error) {
      throw new UnauthorizedException();
    }
  }

  async confirmPasswordReset(
    passwordResetConfirmDto: PasswordResetConfirmDto,
  ) {
    const { email, password, confirmationToken } = passwordResetConfirmDto;

    // Find user (FIX: Fixed undefined variable - use email from DTO)
    const user = await this._userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Check if new password is different from old one
    const isSamePassword = await this.verifyPassword(user.password, password);
    if (isSamePassword) {
      throw new BadRequestException(
        'New password should be different from old one',
      );
    }

    // Find and verify confirmation token
    const confirmation = await this._confirmationRepository.findOne({
      where: {
        userId: user.id,
        type: ConfirmationType.PASSWORD_RESET,
        token: confirmationToken,
      },
    });
    if (!confirmation) {
      throw new BadRequestException('Confirmation token is incorrect');
    }

    try {
      // Hash new password
      const hash = await this.hashPassword(password);

      // Update password
      user.password = hash;
      await this._userRepository.save(user);

      // Delete confirmation
      await this._confirmationRepository.delete(confirmation.id);

      return {
        success: true,
        info: 'Password has been changed successfully.',
      };
    } catch (_error) {
      throw new InternalServerErrorException();
    }
  }

  async verifyEmail(emailVerifyDto: EmailVerifyDto) {
    const { email, code } = emailVerifyDto;

    // Find user
    const user = await this._userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Clean code (remove spaces)
    const confCode = code.replace(/\s/g, '');

    // Find confirmation - check both EMAIL_VERIFY and PASSWORD_RESET types
    const confirmation =
      (await this._confirmationRepository.findOne({
        where: {
          userId: user.id,
          type: ConfirmationType.EMAIL_VERIFY,
          code: confCode,
        },
      })) ||
      (await this._confirmationRepository.findOne({
        where: {
          userId: user.id,
          type: ConfirmationType.PASSWORD_RESET,
          code: confCode,
        },
      }));
    if (!confirmation) {
      throw new ConflictException('Code is incorrect');
    }

    try {
      // Generate confirmation token
      const confirmationToken = randomBytes(8).toString('hex');

      // Update confirmation with token
      confirmation.token = confirmationToken;
      await this._confirmationRepository.save(confirmation);

      return {
        success: true,
        confirmationToken: confirmationToken,
        info: 'Email has been confirmed successfully.',
      };
    } catch (_error) {
      throw new InternalServerErrorException();
    }
  }

  async refreshToken(refreshDto: RefreshDto) {
    const { token } = refreshDto;

    if (!token) {
      throw new UnauthorizedException('Refresh token required');
    }

    try {
      // Verify refresh token
      const payload = jwt.verify(
        token,
        this.authConfig.refreshTokenSecret,
      ) as unknown as JwtPayload;

      // Verify token exists in database
      const refreshTokenEntity = await this._refreshTokenRepository.findOne({
        where: {
          token,
          userId: payload.sub,
        },
      });
      if (!refreshTokenEntity) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new access token
      const accessTokenOptions: SignOptions = {
        expiresIn: this.authConfig.accessTokenExpiration as SignOptions['expiresIn'],
      };
      const accessToken = jwt.sign(
        { sub: payload.sub },
        this.authConfig.accessTokenSecret,
        accessTokenOptions,
      );

      return {
        success: true,
        accessToken,
      };
    } catch (_error) {
      throw new UnauthorizedException();
    }
  }

  async logout(logoutDto: LogoutDto) {
    const { token } = logoutDto;

    if (!token) {
      throw new UnauthorizedException('Refresh token required');
    }

    try {
      // Verify refresh token
      const payload = jwt.verify(
        token,
        this.authConfig.refreshTokenSecret,
      ) as unknown as JwtPayload;

      // Find refresh token entity
      const refreshTokenEntity = await this._refreshTokenRepository.findOne({
        where: {
          token,
          userId: payload.sub,
        },
      });
      if (!refreshTokenEntity) {
        throw new BadRequestException('Invalid refresh token');
      }

      // Delete refresh token
      await this._refreshTokenRepository.delete(refreshTokenEntity.id);

      return {
        success: true,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new UnauthorizedException();
    }
  }

  // Helper methods
  private async generateTokens(userId: number) {
    const payload: JwtPayload = { sub: userId };

    const accessTokenOptions: SignOptions = {
      expiresIn: this.authConfig.accessTokenExpiration as SignOptions['expiresIn'],
    };
    const accessToken = jwt.sign(
      payload,
      this.authConfig.accessTokenSecret,
      accessTokenOptions,
    );

    const refreshTokenOptions: SignOptions = {
      expiresIn: this.authConfig.refreshTokenExpiration as SignOptions['expiresIn'],
    };
    const refreshToken = jwt.sign(
      payload,
      this.authConfig.refreshTokenSecret,
      refreshTokenOptions,
    );

    return { accessToken, refreshToken };
  }

  private async hashPassword(password: string): Promise<string> {
    return argon2.hash(password + this.authConfig.pepper, {
      type: argon2.argon2id,
      memoryCost: 15360,
      timeCost: 2,
    });
  }

  private async verifyPassword(
    hashedPassword: string,
    plainPassword: string,
  ): Promise<boolean> {
    return argon2.verify(
      hashedPassword,
      plainPassword + this.authConfig.pepper,
    );
  }

  private async sendEmail(
    to: string,
    subject: string,
    text: string,
  ): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: 'PresenterKit <no-reply@email.presenterkit.app>',
      to,
      subject: subject || 'Password Reset',
      html: text || `Hello ${to},<br><br>You are receiving this email because you (or someone else) have requested the reset of the password for your account.`,
    });

    if (error) {
      console.log('Email could not send:', error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }
}


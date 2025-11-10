import { Test, type TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { VerifyDto } from './dto/verify.dto';
import { LoginDto } from './dto/login.dto';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import { PasswordResetConfirmDto } from './dto/password-reset-confirm.dto';
import { EmailVerifyDto } from './dto/email-verify.dto';
import { RefreshDto } from './dto/refresh.dto';
import { LogoutDto } from './dto/logout.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    verify: jest.fn(),
    login: jest.fn(),
    requestPasswordReset: jest.fn(),
    confirmPasswordReset: jest.fn(),
    verifyEmail: jest.fn(),
    refreshToken: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should return success message when registration is successful', async () => {
      const registerDto: RegisterDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test123!@#',
      };

      const expectedResponse = {
        success: true,
        info: 'Confirmation code sent to your email.',
      };

      mockAuthService.register.mockResolvedValue(expectedResponse);

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(expectedResponse);
    });

    it('should handle service errors appropriately', async () => {
      const registerDto: RegisterDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test123!@#',
      };

      mockAuthService.register.mockRejectedValue(
        new BadRequestException('This email is already registered'),
      );

      await expect(controller.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should pass DTO to service', async () => {
      const registerDto: RegisterDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test123!@#',
      };

      mockAuthService.register.mockResolvedValue({
        success: true,
        info: 'Confirmation code sent to your email.',
      });

      await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(authService.register).toHaveBeenCalledTimes(1);
    });
  });

  describe('verify', () => {
    it('should return tokens when verification succeeds', async () => {
      const verifyDto: VerifyDto = {
        email: 'test@example.com',
        otp: '123456',
      };

      const expectedResponse = {
        success: true,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      mockAuthService.verify.mockResolvedValue(expectedResponse);

      const result = await controller.verify(verifyDto);

      expect(authService.verify).toHaveBeenCalledWith(verifyDto);
      expect(result).toEqual(expectedResponse);
    });

    it('should handle invalid OTP/email errors', async () => {
      const verifyDto: VerifyDto = {
        email: 'test@example.com',
        otp: '123456',
      };

      mockAuthService.verify.mockRejectedValue(
        new BadRequestException('Invalid confirmation code or email'),
      );

      await expect(controller.verify(verifyDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(authService.verify).toHaveBeenCalledWith(verifyDto);
    });

    it('should pass DTO to service', async () => {
      const verifyDto: VerifyDto = {
        email: 'test@example.com',
        otp: '123456',
      };

      mockAuthService.verify.mockResolvedValue({
        success: true,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      await controller.verify(verifyDto);

      expect(authService.verify).toHaveBeenCalledWith(verifyDto);
      expect(authService.verify).toHaveBeenCalledTimes(1);
    });
  });

  describe('login', () => {
    it('should return tokens when login succeeds', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'Test123!@#',
      };

      const expectedResponse = {
        success: true,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      mockAuthService.login.mockResolvedValue(expectedResponse);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResponse);
    });

    it('should handle invalid credentials errors', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'WrongPassword123!',
      };

      mockAuthService.login.mockRejectedValue(
        new BadRequestException('Invalid email or password'),
      );

      await expect(controller.login(loginDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should pass DTO to service', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'Test123!@#',
      };

      mockAuthService.login.mockResolvedValue({
        success: true,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(authService.login).toHaveBeenCalledTimes(1);
    });
  });

  describe('requestPasswordReset', () => {
    it('should return success message when request is sent', async () => {
      const passwordResetRequestDto: PasswordResetRequestDto = {
        email: 'test@example.com',
      };

      const expectedResponse = {
        success: true,
        info: 'Confirmation code has been sent to your email.',
      };

      mockAuthService.requestPasswordReset.mockResolvedValue(
        expectedResponse,
      );

      const result = await controller.requestPasswordReset(
        passwordResetRequestDto,
      );

      expect(authService.requestPasswordReset).toHaveBeenCalledWith(
        passwordResetRequestDto,
      );
      expect(result).toEqual(expectedResponse);
    });

    it('should handle user not found errors', async () => {
      const passwordResetRequestDto: PasswordResetRequestDto = {
        email: 'nonexistent@example.com',
      };

      mockAuthService.requestPasswordReset.mockRejectedValue(
        new BadRequestException('User not found'),
      );

      await expect(
        controller.requestPasswordReset(passwordResetRequestDto),
      ).rejects.toThrow(BadRequestException);
      expect(authService.requestPasswordReset).toHaveBeenCalledWith(
        passwordResetRequestDto,
      );
    });

    it('should pass DTO to service', async () => {
      const passwordResetRequestDto: PasswordResetRequestDto = {
        email: 'test@example.com',
      };

      mockAuthService.requestPasswordReset.mockResolvedValue({
        success: true,
        info: 'Confirmation code has been sent to your email.',
      });

      await controller.requestPasswordReset(passwordResetRequestDto);

      expect(authService.requestPasswordReset).toHaveBeenCalledWith(
        passwordResetRequestDto,
      );
      expect(authService.requestPasswordReset).toHaveBeenCalledTimes(1);
    });
  });

  describe('confirmPasswordReset', () => {
    it('should return success message when password is reset', async () => {
      const passwordResetConfirmDto: PasswordResetConfirmDto = {
        email: 'test@example.com',
        password: 'NewPassword123!@#',
        confirmationToken: 'confirmation-token',
      };

      const expectedResponse = {
        success: true,
        info: 'Password has been changed successfully.',
      };

      mockAuthService.confirmPasswordReset.mockResolvedValue(
        expectedResponse,
      );

      const result = await controller.confirmPasswordReset(
        passwordResetConfirmDto,
      );

      expect(authService.confirmPasswordReset).toHaveBeenCalledWith(
        passwordResetConfirmDto,
      );
      expect(result).toEqual(expectedResponse);
    });

    it('should handle invalid token/user errors', async () => {
      const passwordResetConfirmDto: PasswordResetConfirmDto = {
        email: 'test@example.com',
        password: 'NewPassword123!@#',
        confirmationToken: 'invalid-token',
      };

      mockAuthService.confirmPasswordReset.mockRejectedValue(
        new BadRequestException('Confirmation token is incorrect'),
      );

      await expect(
        controller.confirmPasswordReset(passwordResetConfirmDto),
      ).rejects.toThrow(BadRequestException);
      expect(authService.confirmPasswordReset).toHaveBeenCalledWith(
        passwordResetConfirmDto,
      );
    });

    it('should pass DTO to service', async () => {
      const passwordResetConfirmDto: PasswordResetConfirmDto = {
        email: 'test@example.com',
        password: 'NewPassword123!@#',
        confirmationToken: 'confirmation-token',
      };

      mockAuthService.confirmPasswordReset.mockResolvedValue({
        success: true,
        info: 'Password has been changed successfully.',
      });

      await controller.confirmPasswordReset(passwordResetConfirmDto);

      expect(authService.confirmPasswordReset).toHaveBeenCalledWith(
        passwordResetConfirmDto,
      );
      expect(authService.confirmPasswordReset).toHaveBeenCalledTimes(1);
    });
  });

  describe('verifyEmail', () => {
    it('should return confirmation token when email is verified', async () => {
      const emailVerifyDto: EmailVerifyDto = {
        email: 'test@example.com',
        code: '123456',
      };

      const expectedResponse = {
        success: true,
        confirmationToken: 'confirmation-token',
        info: 'Email has been confirmed successfully.',
      };

      mockAuthService.verifyEmail.mockResolvedValue(expectedResponse);

      const result = await controller.verifyEmail(emailVerifyDto);

      expect(authService.verifyEmail).toHaveBeenCalledWith(emailVerifyDto);
      expect(result).toEqual(expectedResponse);
    });

    it('should handle invalid code errors', async () => {
      const emailVerifyDto: EmailVerifyDto = {
        email: 'test@example.com',
        code: '000000',
      };

      mockAuthService.verifyEmail.mockRejectedValue(
        new ConflictException('Code is incorrect'),
      );

      await expect(controller.verifyEmail(emailVerifyDto)).rejects.toThrow(
        ConflictException,
      );
      expect(authService.verifyEmail).toHaveBeenCalledWith(emailVerifyDto);
    });

    it('should pass DTO to service', async () => {
      const emailVerifyDto: EmailVerifyDto = {
        email: 'test@example.com',
        code: '123456',
      };

      mockAuthService.verifyEmail.mockResolvedValue({
        success: true,
        confirmationToken: 'confirmation-token',
        info: 'Email has been confirmed successfully.',
      });

      await controller.verifyEmail(emailVerifyDto);

      expect(authService.verifyEmail).toHaveBeenCalledWith(emailVerifyDto);
      expect(authService.verifyEmail).toHaveBeenCalledTimes(1);
    });
  });

  describe('refreshToken', () => {
    it('should return new access token when refresh succeeds', async () => {
      const refreshDto: RefreshDto = {
        token: 'valid-refresh-token',
      };

      const expectedResponse = {
        success: true,
        accessToken: 'new-access-token',
      };

      mockAuthService.refreshToken.mockResolvedValue(expectedResponse);

      const result = await controller.refreshToken(refreshDto);

      expect(authService.refreshToken).toHaveBeenCalledWith(refreshDto);
      expect(result).toEqual(expectedResponse);
    });

    it('should handle invalid/expired token errors', async () => {
      const refreshDto: RefreshDto = {
        token: 'invalid-refresh-token',
      };

      mockAuthService.refreshToken.mockRejectedValue(
        new UnauthorizedException('Invalid refresh token'),
      );

      await expect(controller.refreshToken(refreshDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authService.refreshToken).toHaveBeenCalledWith(refreshDto);
    });

    it('should pass DTO to service', async () => {
      const refreshDto: RefreshDto = {
        token: 'valid-refresh-token',
      };

      mockAuthService.refreshToken.mockResolvedValue({
        success: true,
        accessToken: 'new-access-token',
      });

      await controller.refreshToken(refreshDto);

      expect(authService.refreshToken).toHaveBeenCalledWith(refreshDto);
      expect(authService.refreshToken).toHaveBeenCalledTimes(1);
    });
  });

  describe('logout', () => {
    it('should return success when logout succeeds', async () => {
      const logoutDto: LogoutDto = {
        token: 'valid-refresh-token',
      };

      const expectedResponse = {
        success: true,
      };

      mockAuthService.logout.mockResolvedValue(expectedResponse);

      const result = await controller.logout(logoutDto);

      expect(authService.logout).toHaveBeenCalledWith(logoutDto);
      expect(result).toEqual(expectedResponse);
    });

    it('should handle invalid token errors', async () => {
      const logoutDto: LogoutDto = {
        token: 'invalid-refresh-token',
      };

      mockAuthService.logout.mockRejectedValue(
        new UnauthorizedException('Invalid refresh token'),
      );

      await expect(controller.logout(logoutDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authService.logout).toHaveBeenCalledWith(logoutDto);
    });

    it('should pass DTO to service', async () => {
      const logoutDto: LogoutDto = {
        token: 'valid-refresh-token',
      };

      mockAuthService.logout.mockResolvedValue({
        success: true,
      });

      await controller.logout(logoutDto);

      expect(authService.logout).toHaveBeenCalledWith(logoutDto);
      expect(authService.logout).toHaveBeenCalledTimes(1);
    });
  });
});


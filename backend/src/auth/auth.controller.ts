import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailVerifyDto } from './dto/email-verify.dto';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { PasswordResetConfirmDto } from './dto/password-reset-confirm.dto';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyDto } from './dto/verify.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verify(@Body() verifyDto: VerifyDto) {
    return this.authService.verify(verifyDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('password-reset/request')
  @HttpCode(HttpStatus.OK)
  async requestPasswordReset(
    @Body() passwordResetRequestDto: PasswordResetRequestDto,
  ) {
    return this.authService.requestPasswordReset(passwordResetRequestDto);
  }

  @Post('password-reset/confirm')
  @HttpCode(HttpStatus.OK)
  async confirmPasswordReset(
    @Body() passwordResetConfirmDto: PasswordResetConfirmDto,
  ) {
    return this.authService.confirmPasswordReset(passwordResetConfirmDto);
  }

  @Post('email/verify')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() emailVerifyDto: EmailVerifyDto) {
    return this.authService.verifyEmail(emailVerifyDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() refreshDto: RefreshDto) {
    return this.authService.refreshToken(refreshDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() logoutDto: LogoutDto) {
    return this.authService.logout(logoutDto);
  }
}


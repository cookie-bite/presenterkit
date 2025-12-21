import { IsEmail, IsString, Matches } from 'class-validator';

export class EmailVerifyDto {
  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^(\d\s*){6}$/, {
    message: 'Code must be a 6-digit code',
  })
  code: string;
}

import { IsEmail, IsString } from "class-validator";

export class PasswordResetConfirmDto {
	@IsEmail()
	email: string;

	@IsString()
	password: string;

	@IsString()
	confirmationToken: string;
}

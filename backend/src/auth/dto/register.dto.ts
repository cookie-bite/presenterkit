import {
	IsEmail,
	IsString,
	Matches,
	MaxLength,
	MinLength,
} from "class-validator";

export class RegisterDto {
	@IsString()
	@MinLength(3)
	@MaxLength(30)
	username: string;

	@IsEmail()
	email: string;

	@IsString()
	@MinLength(8)
	@MaxLength(30)
	@Matches(/.*[a-z].*/, {
		message: "Password must contain at least one lowercase letter",
	})
	@Matches(/.*[A-Z].*/, {
		message: "Password must contain at least one uppercase letter",
	})
	@Matches(/.*[0-9].*/, {
		message: "Password must contain at least one digit",
	})
	@Matches(/.*[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~].*/, {
		message: "Password must contain at least one special character",
	})
	password: string;
}

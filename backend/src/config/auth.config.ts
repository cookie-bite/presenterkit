import { Configuration, Value } from "@itgorillaz/configify";
import { IsString } from "class-validator";

@Configuration()
export class AuthConfig {
	@IsString()
	@Value("ACS_TKN_SCT")
	accessTokenSecret: string;

	@IsString()
	@Value("ACS_TKN_EXP")
	accessTokenExpiration: string;

	@IsString()
	@Value("RFS_TKN_SCT")
	refreshTokenSecret: string;

	@IsString()
	@Value("RFS_TKN_EXP")
	refreshTokenExpiration: string;

	@IsString()
	@Value("PEPPER")
	pepper: string;

	@IsString()
	@Value("RESEND_API_KEY")
	resendApiKey: string;
}

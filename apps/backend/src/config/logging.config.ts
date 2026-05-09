import { Configuration, Value } from '@itgorillaz/configify';
import { IsOptional, IsString } from 'class-validator';

@Configuration()
export class LoggingConfig {
  @IsOptional()
  @IsString()
  @Value('BETTER_STACK_SOURCE_TOKEN')
  betterStackSourceToken?: string;

  @IsOptional()
  @IsString()
  @Value('LOG_LEVEL')
  logLevel?: string;
}

import { Configuration, Value } from "@itgorillaz/configify";
import { IsNumber } from "class-validator";

@Configuration()
export class AppConfig {
  @IsNumber()
  @Value('PORT', { parse: (value) => +value })
  port: number;
}
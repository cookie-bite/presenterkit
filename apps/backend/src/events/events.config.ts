import { Configuration, Value } from '@itgorillaz/configify';
import { IsOptional, IsString } from 'class-validator';

@Configuration()
export class EventsConfig {
  @IsOptional()
  @IsString()
  @Value('DEFAULT_EVENT_ID', { parse: v => v ?? 'sandbox' })
  defaultEventId: string;
}

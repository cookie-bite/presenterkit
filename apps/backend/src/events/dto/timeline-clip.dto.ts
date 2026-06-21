import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class TimelineClipDto {
  @IsString()
  instanceId: string;

  @IsInt()
  fileId: number;

  @IsNumber()
  duration: number;

  @IsOptional()
  @IsNumber()
  startTime?: number;
}

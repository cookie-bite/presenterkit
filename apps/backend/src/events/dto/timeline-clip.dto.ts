import { IsInt, IsString } from 'class-validator';

export class TimelineClipDto {
  @IsString()
  instanceId: string;

  @IsInt()
  fileId: number;
}

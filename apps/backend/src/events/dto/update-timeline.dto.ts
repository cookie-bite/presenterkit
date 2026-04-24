import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, ValidateNested } from 'class-validator';

import { TimelineClipDto } from './timeline-clip.dto';

export class UpdateTimelineDto {
  @IsArray()
  @ArrayMaxSize(500)
  @ValidateNested({ each: true })
  @Type(() => TimelineClipDto)
  clips: TimelineClipDto[];
}

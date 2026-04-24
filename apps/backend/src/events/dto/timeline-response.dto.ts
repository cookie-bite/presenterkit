import { TimelineClipDto } from './timeline-clip.dto';

export class TimelineResponseDto {
  clips: TimelineClipDto[];
  updatedAt: Date;
}

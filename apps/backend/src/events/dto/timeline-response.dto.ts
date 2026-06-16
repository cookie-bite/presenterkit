import { TimelineClipDto } from './timeline-clip.dto';

export class TimelineResponseDto {
  clips: TimelineClipDto[];
  audioClips: TimelineClipDto[];
  updatedAt: Date;
}

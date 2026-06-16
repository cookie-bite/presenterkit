import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EventResponseDto } from './dto/event-response.dto';
import { TimelineResponseDto } from './dto/timeline-response.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';
import { EventsService } from './events.service';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async listEvents(@Request() req): Promise<EventResponseDto[]> {
    const userId = req.user.userId;
    const events = await this.eventsService.listByUser(userId);

    return events.map(e => ({
      eventID: e.eventID,
      name: e.name,
      isDefault: e.isDefault,
      uploadToken: e.uploadToken,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
    }));
  }

  @Get(':eventID')
  async getEvent(@Request() req, @Param('eventID') eventID: string): Promise<EventResponseDto> {
    const userId = req.user.userId;
    const event = await this.eventsService.findByEventID(userId, eventID);

    return {
      eventID: event.eventID,
      name: event.name,
      isDefault: event.isDefault,
      uploadToken: event.uploadToken,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };
  }

  @Get(':eventID/timeline')
  async getTimeline(
    @Request() req,
    @Param('eventID') eventID: string,
  ): Promise<TimelineResponseDto> {
    const userId = req.user.userId;
    return this.eventsService.getTimelineTrack(userId, eventID);
  }

  @Post(':eventID/upload-link')
  async createUploadLink(
    @Request() req,
    @Param('eventID') eventID: string,
  ): Promise<{ token: string }> {
    const userId = req.user.userId;
    const token = await this.eventsService.createUploadLink(userId, eventID);
    return { token };
  }

  @Delete(':eventID/upload-link')
  @HttpCode(HttpStatus.NO_CONTENT)
  async revokeUploadLink(@Request() req, @Param('eventID') eventID: string): Promise<void> {
    const userId = req.user.userId;
    await this.eventsService.revokeUploadLink(userId, eventID);
  }

  @Put(':eventID/timeline')
  async updateTimeline(
    @Request() req,
    @Param('eventID') eventID: string,
    @Body() dto: UpdateTimelineDto,
  ): Promise<TimelineResponseDto> {
    const userId = req.user.userId;
    return this.eventsService.saveTimelineTrack(userId, eventID, dto.clips, dto.audioClips);
  }
}

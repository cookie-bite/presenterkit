import { Body, Controller, Get, Param, Put, Request, UseGuards } from '@nestjs/common';

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

  @Put(':eventID/timeline')
  async updateTimeline(
    @Request() req,
    @Param('eventID') eventID: string,
    @Body() dto: UpdateTimelineDto,
  ): Promise<TimelineResponseDto> {
    const userId = req.user.userId;
    return this.eventsService.saveTimelineTrack(userId, eventID, dto.clips);
  }
}

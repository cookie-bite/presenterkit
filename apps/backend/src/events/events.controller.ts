import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EventResponseDto } from './dto/event-response.dto';
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
}

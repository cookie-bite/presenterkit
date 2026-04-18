import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { Event } from './entities/event.entity';
import { EventsConfig } from './events.config';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly eventsConfig: EventsConfig,
  ) {}

  async ensureDefaultEvent(userId: number): Promise<Event> {
    const eventID = this.eventsConfig.defaultEventId;

    await this.eventRepository.upsert(
      {
        userId,
        eventID,
        name: 'Sandbox',
        isDefault: true,
      },
      ['userId', 'eventID'],
    );

    return this.eventRepository.findOneOrFail({
      where: { userId, eventID },
    });
  }

  async findByEventID(userId: number, eventID: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { userId, eventID },
    });

    if (!event) {
      throw new NotFoundException(`Event '${eventID}' not found`);
    }

    return event;
  }

  async listByUser(userId: number): Promise<Event[]> {
    return this.eventRepository.find({
      where: { userId },
      order: { createdAt: 'ASC' },
    });
  }
}

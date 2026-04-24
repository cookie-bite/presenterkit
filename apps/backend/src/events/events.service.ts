import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, type Repository } from 'typeorm';

import { File } from '../files/entities/file.entity';
import { TimelineClipDto } from './dto/timeline-clip.dto';
import { Event } from './entities/event.entity';
import { EventsConfig } from './events.config';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
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

  async getTimelineTrack(
    userId: number,
    eventID: string,
  ): Promise<{ clips: TimelineClipDto[]; updatedAt: Date }> {
    const event = await this.findByEventID(userId, eventID);
    return {
      clips: event.timelineTrack ?? [],
      updatedAt: event.updatedAt,
    };
  }

  async saveTimelineTrack(
    userId: number,
    eventID: string,
    clips: TimelineClipDto[],
  ): Promise<{ clips: TimelineClipDto[]; updatedAt: Date }> {
    const event = await this.findByEventID(userId, eventID);
    const fileIds = [...new Set(clips.map(clip => clip.fileId))];

    if (fileIds.length > 0) {
      const validFilesCount = await this.fileRepository.count({
        where: {
          id: In(fileIds),
          userId,
          eventId: event.id,
        },
      });

      if (validFilesCount !== fileIds.length) {
        throw new BadRequestException('Timeline contains invalid fileId');
      }
    }

    event.timelineTrack = clips;
    const savedEvent = await this.eventRepository.save(event);

    return {
      clips: savedEvent.timelineTrack,
      updatedAt: savedEvent.updatedAt,
    };
  }
}

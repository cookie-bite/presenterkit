import { randomUUID } from 'node:crypto';

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
  ): Promise<{ clips: TimelineClipDto[]; audioClips: TimelineClipDto[]; updatedAt: Date }> {
    const event = await this.findByEventID(userId, eventID);
    return {
      clips: event.timelineTrack ?? [],
      audioClips: event.audioTrack ?? [],
      updatedAt: event.updatedAt,
    };
  }

  async saveTimelineTrack(
    userId: number,
    eventID: string,
    clips: TimelineClipDto[],
    audioClips: TimelineClipDto[],
  ): Promise<{ clips: TimelineClipDto[]; audioClips: TimelineClipDto[]; updatedAt: Date }> {
    const event = await this.findByEventID(userId, eventID);
    const allFileIds = [
      ...new Set([...clips.map(c => c.fileId), ...audioClips.map(c => c.fileId)]),
    ];

    if (allFileIds.length > 0) {
      const validFilesCount = await this.fileRepository.count({
        where: {
          id: In(allFileIds),
          userId,
          eventId: event.id,
        },
      });

      if (validFilesCount !== allFileIds.length) {
        throw new BadRequestException('Timeline contains invalid fileId');
      }
    }

    event.timelineTrack = clips;
    event.audioTrack = audioClips;
    const savedEvent = await this.eventRepository.save(event);

    return {
      clips: savedEvent.timelineTrack,
      audioClips: savedEvent.audioTrack,
      updatedAt: savedEvent.updatedAt,
    };
  }

  async createUploadLink(userId: number, eventID: string): Promise<string> {
    const event = await this.findByEventID(userId, eventID);
    event.uploadToken = randomUUID();
    await this.eventRepository.save(event);
    return event.uploadToken;
  }

  async revokeUploadLink(userId: number, eventID: string): Promise<void> {
    const event = await this.findByEventID(userId, eventID);
    event.uploadToken = null;
    await this.eventRepository.save(event);
  }

  async findByUploadToken(token: string): Promise<Event | null> {
    return this.eventRepository.findOne({ where: { uploadToken: token } });
  }

  async removeClipsForFileId(userId: number, eventID: string, fileId: number): Promise<void> {
    const event = await this.findByEventID(userId, eventID);
    const nextTrack = (event.timelineTrack ?? []).filter(clip => clip.fileId !== fileId);
    const nextAudioTrack = (event.audioTrack ?? []).filter(clip => clip.fileId !== fileId);
    const changed =
      nextTrack.length !== (event.timelineTrack ?? []).length ||
      nextAudioTrack.length !== (event.audioTrack ?? []).length;
    if (!changed) return;
    event.timelineTrack = nextTrack;
    event.audioTrack = nextAudioTrack;
    await this.eventRepository.save(event);
  }
}

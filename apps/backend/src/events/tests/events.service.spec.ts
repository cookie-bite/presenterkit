import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { File } from '../../files/entities/file.entity';
import { Event } from '../entities/event.entity';
import { EventsConfig } from '../events.config';
import { EventsService } from '../events.service';

describe('EventsService', () => {
  let service: EventsService;

  const mockEventRepository = {
    upsert: jest.fn(),
    findOneOrFail: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
  };

  const mockFileRepository = {
    count: jest.fn(),
  };

  const mockEventsConfig = {
    defaultEventId: 'sandbox',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: mockEventRepository,
        },
        {
          provide: getRepositoryToken(File),
          useValue: mockFileRepository,
        },
        {
          provide: EventsConfig,
          useValue: mockEventsConfig,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const makeEvent = (overrides?: Partial<Event>): Event =>
    ({
      id: 11,
      eventID: 'sandbox',
      name: 'Sandbox',
      isDefault: true,
      userId: 4,
      user: {} as Event['user'],
      files: [],
      timelineTrack: [],
      createdAt: new Date('2026-04-24T11:00:00.000Z'),
      updatedAt: new Date('2026-04-24T12:00:00.000Z'),
      ...overrides,
    }) as Event;

  describe('getTimelineTrack', () => {
    it('should return timeline clips and updatedAt', async () => {
      const event = makeEvent({
        timelineTrack: [{ instanceId: 'clip-1', fileId: 1 }],
        updatedAt: new Date('2026-04-24T12:00:00.000Z'),
      });
      mockEventRepository.findOne.mockResolvedValue(event);

      const result = await service.getTimelineTrack(4, 'sandbox');

      expect(mockEventRepository.findOne).toHaveBeenCalledWith({
        where: { userId: 4, eventID: 'sandbox' },
      });
      expect(result).toEqual({
        clips: [{ instanceId: 'clip-1', fileId: 1 }],
        updatedAt: event.updatedAt,
      });
    });
  });

  describe('saveTimelineTrack', () => {
    it('should save timeline when all file ids are valid', async () => {
      const event = makeEvent();
      const clips = [
        { instanceId: 'clip-1', fileId: 1 },
        { instanceId: 'clip-2', fileId: 2 },
      ];
      const savedEvent = makeEvent({
        timelineTrack: clips,
        updatedAt: new Date('2026-04-24T12:02:00.000Z'),
      });
      mockEventRepository.findOne.mockResolvedValue(event);
      mockFileRepository.count.mockResolvedValue(2);
      mockEventRepository.save.mockResolvedValue(savedEvent);

      const result = await service.saveTimelineTrack(4, 'sandbox', clips);

      expect(mockFileRepository.count).toHaveBeenCalledWith({
        where: {
          id: expect.anything(),
          userId: 4,
          eventId: 11,
        },
      });
      expect(mockEventRepository.save).toHaveBeenCalledWith({
        ...event,
        timelineTrack: clips,
      });
      expect(result).toEqual({
        clips,
        updatedAt: savedEvent.updatedAt,
      });
    });

    it('should reject whole payload when any file id is invalid', async () => {
      const event = makeEvent({
        timelineTrack: [{ instanceId: 'old-clip', fileId: 1 }],
        updatedAt: new Date('2026-04-24T12:00:00.000Z'),
      });
      const clips = [
        { instanceId: 'clip-1', fileId: 1 },
        { instanceId: 'clip-2', fileId: 999 },
      ];
      mockEventRepository.findOne.mockResolvedValue(event);
      mockFileRepository.count.mockResolvedValue(1);

      await expect(service.saveTimelineTrack(4, 'sandbox', clips)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockEventRepository.save).not.toHaveBeenCalled();
    });

    it('should throw not found when event does not exist', async () => {
      mockEventRepository.findOne.mockResolvedValue(null);

      await expect(service.getTimelineTrack(4, 'unknown-event')).rejects.toThrow(NotFoundException);
    });
  });
});

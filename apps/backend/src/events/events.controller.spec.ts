import { BadRequestException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';

import { EventsController } from './events.controller';
import { EventsService } from './events.service';

describe('EventsController', () => {
  let controller: EventsController;
  let eventsService: EventsService;

  const mockEventsService = {
    listByUser: jest.fn(),
    findByEventID: jest.fn(),
    getTimelineTrack: jest.fn(),
    saveTimelineTrack: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: EventsService,
          useValue: mockEventsService,
        },
      ],
    }).compile();

    controller = module.get<EventsController>(EventsController);
    eventsService = module.get<EventsService>(EventsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTimeline', () => {
    it('should return clips and updatedAt for the event', async () => {
      const req = { user: { userId: 21 } };
      const response = {
        clips: [{ instanceId: 'clip-1', fileId: 5 }],
        updatedAt: new Date('2026-04-24T12:00:00.000Z'),
      };
      mockEventsService.getTimelineTrack.mockResolvedValue(response);

      const result = await controller.getTimeline(req, 'sandbox');

      expect(eventsService.getTimelineTrack).toHaveBeenCalledWith(21, 'sandbox');
      expect(result).toEqual(response);
    });
  });

  describe('updateTimeline', () => {
    it('should pass clips to service and return saved timeline', async () => {
      const req = { user: { userId: 21 } };
      const clips = [
        { instanceId: 'clip-1', fileId: 5 },
        { instanceId: 'clip-2', fileId: 7 },
      ];
      const response = {
        clips,
        updatedAt: new Date('2026-04-24T12:05:00.000Z'),
      };
      mockEventsService.saveTimelineTrack.mockResolvedValue(response);

      const result = await controller.updateTimeline(req, 'sandbox', { clips });

      expect(eventsService.saveTimelineTrack).toHaveBeenCalledWith(21, 'sandbox', clips);
      expect(result).toEqual(response);
    });

    it('should propagate bad request errors for invalid file ids', async () => {
      const req = { user: { userId: 21 } };
      const clips = [{ instanceId: 'clip-1', fileId: 9999 }];
      mockEventsService.saveTimelineTrack.mockRejectedValue(
        new BadRequestException('Timeline contains invalid fileId'),
      );

      await expect(controller.updateTimeline(req, 'sandbox', { clips })).rejects.toThrow(
        BadRequestException,
      );
      expect(eventsService.saveTimelineTrack).toHaveBeenCalledWith(21, 'sandbox', clips);
    });
  });
});

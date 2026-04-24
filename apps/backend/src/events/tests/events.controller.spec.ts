import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';

import { EventsController } from '../events.controller';
import { EventsService } from '../events.service';

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

  describe('listEvents', () => {
    it('should return mapped event list', async () => {
      const req = { user: { userId: 21 } };
      const events = [
        {
          eventID: 'sandbox',
          name: 'Sandbox',
          isDefault: true,
          createdAt: new Date('2026-04-24T10:00:00.000Z'),
          updatedAt: new Date('2026-04-24T11:00:00.000Z'),
        },
        {
          eventID: 'demo',
          name: 'Demo',
          isDefault: false,
          createdAt: new Date('2026-04-23T10:00:00.000Z'),
          updatedAt: new Date('2026-04-23T11:00:00.000Z'),
        },
      ];
      mockEventsService.listByUser.mockResolvedValue(events);

      const result = await controller.listEvents(req);

      expect(eventsService.listByUser).toHaveBeenCalledWith(21);
      expect(result).toEqual(events);
    });
  });

  describe('getEvent', () => {
    it('should return mapped event payload', async () => {
      const req = { user: { userId: 21 } };
      const event = {
        eventID: 'sandbox',
        name: 'Sandbox',
        isDefault: true,
        createdAt: new Date('2026-04-24T10:00:00.000Z'),
        updatedAt: new Date('2026-04-24T11:00:00.000Z'),
      };
      mockEventsService.findByEventID.mockResolvedValue(event);

      const result = await controller.getEvent(req, 'sandbox');

      expect(eventsService.findByEventID).toHaveBeenCalledWith(21, 'sandbox');
      expect(result).toEqual(event);
    });

    it('should propagate not found errors', async () => {
      const req = { user: { userId: 21 } };
      mockEventsService.findByEventID.mockRejectedValue(new NotFoundException('Event not found'));

      await expect(controller.getEvent(req, 'missing')).rejects.toThrow(NotFoundException);
      expect(eventsService.findByEventID).toHaveBeenCalledWith(21, 'missing');
    });
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

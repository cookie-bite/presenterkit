import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';

import { AuthConfig } from '../../config/auth.config';
import { EventsService } from '../../events/events.service';
import { AuthService } from '../auth.service';
import { Confirmation } from '../entities/confirmation.entity';
import { PendingUser } from '../entities/pending-user.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { User } from '../entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  const mockPendingUserRepository = {
    findOne: jest.fn(),
    upsert: jest.fn(),
    delete: jest.fn(),
  };
  const mockRefreshTokenRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };
  const mockConfirmationRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };
  const mockAuthConfig: AuthConfig = {
    accessTokenSecret: 'access-secret',
    refreshTokenSecret: 'refresh-secret',
    accessTokenExpiration: '15m',
    refreshTokenExpiration: '7d',
    pepper: 'pepper',
    resendApiKey: 'resend-key',
    googleClientId: 'google-client-id',
  };
  const mockEventsService = {
    ensureDefaultEvent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: getRepositoryToken(PendingUser), useValue: mockPendingUserRepository },
        { provide: getRepositoryToken(RefreshToken), useValue: mockRefreshTokenRepository },
        { provide: getRepositoryToken(Confirmation), useValue: mockConfirmationRepository },
        { provide: AuthConfig, useValue: mockAuthConfig },
        { provide: EventsService, useValue: mockEventsService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should throw bad request when user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.login({ email: 'missing@e.com', password: '123' })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('refreshToken', () => {
    it('should throw unauthorized when token missing', async () => {
      await expect(service.refreshToken({ token: '' })).rejects.toThrow(UnauthorizedException);
    });

    it('should throw unauthorized when token not in database', async () => {
      const token = jwt.sign({ sub: 9 }, mockAuthConfig.refreshTokenSecret);
      mockRefreshTokenRepository.findOne.mockResolvedValue(null);

      await expect(service.refreshToken({ token })).rejects.toThrow(UnauthorizedException);
    });
  });
});

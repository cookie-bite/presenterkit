import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';

import { EventsService } from '../events/events.service';

@Injectable()
export class UploadTokenGuard implements CanActivate {
  constructor(private readonly eventsService: EventsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { uploadEvent: any }>();
    const token = request.query.token as string;

    if (!token) {
      throw new UnauthorizedException('Upload token is required');
    }

    const event = await this.eventsService.findByUploadToken(token);

    if (!event) {
      throw new UnauthorizedException('Invalid upload token');
    }

    request.uploadEvent = event;
    return true;
  }
}

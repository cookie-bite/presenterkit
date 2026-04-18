import { ConfigifyModule } from '@itgorillaz/configify';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { Event } from './entities/event.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), ConfigifyModule.forRootAsync()],
  controllers: [EventsController],
  providers: [EventsService, JwtStrategy],
  exports: [EventsService],
})
export class EventsModule {}

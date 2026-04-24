import { ConfigifyModule } from '@itgorillaz/configify';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { File } from '../files/entities/file.entity';
import { Event } from './entities/event.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event, File]), ConfigifyModule.forRootAsync()],
  controllers: [EventsController],
  providers: [EventsService, JwtStrategy],
  exports: [EventsService],
})
export class EventsModule {}

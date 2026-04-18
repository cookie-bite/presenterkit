import { ConfigifyModule } from '@itgorillaz/configify';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventsModule } from '../events/events.module';
import { File } from './entities/file.entity';
import { FileController, WebhookController } from './file.controller';
import { FileService } from './file.service';
import { FileProcessingService } from './file-processing.service';

@Module({
  imports: [TypeOrmModule.forFeature([File]), ConfigifyModule.forRootAsync(), EventsModule],
  controllers: [FileController, WebhookController],
  providers: [FileService, FileProcessingService],
  exports: [FileService],
})
export class FileModule {}

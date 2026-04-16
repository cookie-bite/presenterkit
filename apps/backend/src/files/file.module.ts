import { ConfigifyModule } from '@itgorillaz/configify';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { File } from './entities/file.entity';
import { FileController, WebhookController } from './file.controller';
import { FileService } from './file.service';
import { FileProcessingService } from './file-processing.service';

@Module({
  imports: [TypeOrmModule.forFeature([File]), ConfigifyModule.forRootAsync()],
  controllers: [FileController, WebhookController],
  providers: [FileService, FileProcessingService],
  exports: [FileService],
})
export class FileModule {}

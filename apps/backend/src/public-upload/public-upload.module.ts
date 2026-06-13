import { Module } from '@nestjs/common';

import { EventsModule } from '../events/events.module';
import { FileModule } from '../files/file.module';
import { PublicUploadController } from './public-upload.controller';
import { UploadTokenGuard } from './upload-token.guard';

@Module({
  imports: [EventsModule, FileModule],
  controllers: [PublicUploadController],
  providers: [UploadTokenGuard],
})
export class PublicUploadModule {}

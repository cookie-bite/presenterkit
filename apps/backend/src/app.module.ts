import { ConfigifyModule } from '@itgorillaz/configify';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseConfig } from './config/database.config';
import { LoggingConfig } from './config/logging.config';
import { EventsModule } from './events/events.module';
import { FileModule } from './files/file.module';
import { buildPinoLoggerParams } from './logging/pino-params.factory';
import { PublicUploadModule } from './public-upload/public-upload.module';

@Module({
  imports: [
    ConfigifyModule.forRootAsync(),
    LoggerModule.forRootAsync({
      inject: [LoggingConfig],
      useFactory: (logging: LoggingConfig) => buildPinoLoggerParams(logging),
    }),
    TypeOrmModule.forRootAsync({
      inject: [DatabaseConfig],
      useFactory: async (dbConfig: DatabaseConfig) => dbConfig.getTypeOrmConfig(),
    }),
    AuthModule,
    EventsModule,
    FileModule,
    PublicUploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

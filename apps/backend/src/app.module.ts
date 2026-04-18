import { ConfigifyModule } from '@itgorillaz/configify';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseConfig } from './config/database.config';
import { EventsModule } from './events/events.module';
import { FileModule } from './files/file.module';

@Module({
  imports: [
    ConfigifyModule.forRootAsync(),
    TypeOrmModule.forRootAsync({
      inject: [DatabaseConfig],
      useFactory: async (dbConfig: DatabaseConfig) => dbConfig.getTypeOrmConfig(),
    }),
    AuthModule,
    EventsModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

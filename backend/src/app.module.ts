import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigifyModule } from '@itgorillaz/configify';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseConfig } from './config/database.config';
import { Test } from './entities/test.entity';

@Module({
  imports: [
    ConfigifyModule.forRootAsync(),
    TypeOrmModule.forRootAsync({
      inject: [DatabaseConfig],
      useFactory: async (dbConfig: DatabaseConfig) => dbConfig.getTypeOrmConfig(),
    }),
    TypeOrmModule.forFeature([Test]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

import { ConfigifyModule } from '@itgorillaz/configify';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Confirmation } from './entities/confirmation.entity';
import { Event } from './entities/event.entity';
import { PendingUser } from './entities/pending-user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { User } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, PendingUser, RefreshToken, Event, Confirmation]),
    PassportModule,
    JwtModule.register({}),
    ConfigifyModule.forRootAsync(),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}

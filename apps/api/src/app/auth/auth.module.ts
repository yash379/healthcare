import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from './../users/users.module';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serializer';
import { UsersService } from '../users/users.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { NotificationsService } from '../notifications/notifications.service';
import { GoogleStrategy } from './google.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [UsersModule],
  providers: [
    AuthService,
    LocalStrategy,
    SessionSerializer,
    UsersService,
    GoogleStrategy,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    NotificationsService
  ],
  exports: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}

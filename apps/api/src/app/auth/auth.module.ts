import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from './../users/users.module';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serializer';
import { UsersService } from '../users/users.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { NotificationsService } from '../notifications/notifications.service';
import { DoctorsModule } from '../doctors/doctors.module';

@Module({
  imports: [UsersModule, DoctorsModule],
  providers: [
    AuthService,
    LocalStrategy,
    SessionSerializer,
    UsersService,
    DoctorsModule,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    NotificationsService
  ],
  exports: [AuthService],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { DoctorAuthService } from './doctor-auth.service';
import { UsersModule } from '../users/users.module';
import { DoctorLocalStrategy } from './doctor-local.strategy';
import { DoctorSessionSerializer } from './doctor-session.serializer';
import { UsersService } from '../users/users.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { NotificationsService } from '../notifications/notifications.service';
import { DoctorsModule } from '../doctors/doctors.module';
import { DoctorsService } from '../doctors/doctors.service';

@Module({
  imports: [ DoctorsModule],
  providers: [
    DoctorAuthService,
    DoctorLocalStrategy,
    DoctorSessionSerializer,
    DoctorsService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    NotificationsService
  ],
  exports: [DoctorAuthService],
})
export class DoctorAuthModule {}

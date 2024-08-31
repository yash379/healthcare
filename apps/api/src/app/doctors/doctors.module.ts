import { Module } from '@nestjs/common';
import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './doctors.service';
import { NotificationsService } from '../notifications/notifications.service';

@Module({
  controllers: [DoctorsController],
  providers: [DoctorsService,NotificationsService]
})
export class DoctorsModule {}

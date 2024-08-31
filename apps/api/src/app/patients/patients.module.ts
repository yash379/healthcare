import { Module } from '@nestjs/common';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { NotificationsService } from '../notifications/notifications.service';

@Module({
  controllers: [PatientsController],
  providers: [PatientsService, NotificationsService],
})
export class PatientsModule {}

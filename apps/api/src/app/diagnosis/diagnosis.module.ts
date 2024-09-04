import { Module } from '@nestjs/common';
import { DiagnosisController } from './diagnosis.controller';
import { DiagnosisService } from './diagnosis.service';
import { NotificationsService } from '../notifications/notifications.service';

@Module({
    controllers: [DiagnosisController],
    providers: [DiagnosisService,NotificationsService]
})
export class DiagnosisModule {}

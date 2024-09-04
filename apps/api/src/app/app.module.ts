import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuthModule } from './auth/auth.module';
import { LoginModule } from './login/login.module';
import { HospitalsModule } from './hospitals/hospitals.module';
import { DoctorsModule } from './doctors/doctors.module';
import { PatientsModule } from './patients/patients.module';
import { AppointmentsController } from './appointments/appointments.controller';
import { AppointmentsService } from './appointments/appointments.service';
import { AppointmentsModule } from './appointments/appointments.module';
import { CancerDetectionController } from './cancer-detection/cancer-detection.controller';
import { CancerDetectionService } from './cancer-detection/cancer-detection.service';
import { CancerDetectionModule } from './cancer-detection/cancer-detection.module';
import { ChatRequestController } from './chat-request/chat-request.controller';
import { ChatRequestService } from './chat-request/chat-request.service';
import { ChatRequestModule } from './chat-request/chat-request.module';

@Module({
  imports: [
    UsersModule,
    NotificationsModule,
    AuthModule,
    LoginModule,
    HospitalsModule,
    DoctorsModule,
    PatientsModule,
    AppointmentsModule,
    CancerDetectionModule,
    ChatRequestModule,
    // DoctorsModule,
    // PatientsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

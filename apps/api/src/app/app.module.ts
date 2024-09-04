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
import { DiagnosisController } from './diagnosis/diagnosis.controller';
import { DiagnosisService } from './diagnosis/diagnosis.service';
import { DiagnosisModule } from './diagnosis/diagnosis.module';

@Module({
  imports: [
    UsersModule,
    NotificationsModule,
    AuthModule,
    LoginModule,
    HospitalsModule,
    DoctorsModule,
    PatientsModule,
    DiagnosisModule,
    // DoctorsModule,
    // PatientsModule,
  ],
  controllers: [AppController, DiagnosisController],
  providers: [AppService, DiagnosisService],
})
export class AppModule {}

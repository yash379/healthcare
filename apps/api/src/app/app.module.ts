import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuthModule } from './auth/auth.module';
import { LoginModule } from './login/login.module';
import { HospitalsModule } from './hospitals/hospitals.module';
import { DoctorsModule } from './doctors/doctors.module';
import { DoctorLoginModule } from './doctor-login/doctor-login.module';
import { DoctorAuthModule } from './doctor-auth/doctor-auth.module';

@Module({
  imports: [
    UsersModule,
    NotificationsModule,
    // DoctorAuthModule,
    AuthModule,
    // DoctorLoginModule,
    LoginModule,
    HospitalsModule,
    DoctorsModule,
   
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

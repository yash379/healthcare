import { Module } from '@nestjs/common';
import { DoctorLoginController } from './doctor-login.controller';
import { UsersModule } from '../users/users.module';
import { DoctorsModule } from '../doctors/doctors.module';
import { DoctorsService } from '../doctors/doctors.service';

@Module({
    imports:[ DoctorsModule],
    controllers: [DoctorLoginController],
    providers: [DoctorsService],
  })
export class DoctorLoginModule {}

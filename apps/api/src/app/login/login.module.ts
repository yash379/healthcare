import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { UsersModule } from '../users/users.module';
import { DoctorsModule } from '../doctors/doctors.module';
import { DoctorsService } from '../doctors/doctors.service';

@Module({
    imports:[UsersModule, DoctorsModule],
    controllers: [LoginController],
    providers: [DoctorsService],
  })
export class LoginModule {}

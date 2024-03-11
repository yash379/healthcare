import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { comparePasswords } from './bcrypt';
import { DoctorsService } from '../doctors/doctors.service';

@Injectable()
export class DoctorAuthService {
  constructor(private readonly doctorService: DoctorsService) {}

  async validateUser(email: string, hashP: string) {
    const doctor = await this.doctorService.findByEmail(email);
    console.log(doctor);
   
    
    const check = await comparePasswords(hashP, doctor.password);
    if (check) {
      const userRes = { id: doctor.id, name: doctor.firstName, email: doctor.email };
      return userRes;
    } else return null;
  }
}



import { Injectable } from '@nestjs/common';
import { comparePasswords } from './bcrypt';
import { DoctorsService } from '../doctors/doctors.service';

@Injectable()
export class DoctorAuthService {
  constructor(private readonly doctorService: DoctorsService) {}

  async validateDoctor(email: string, hashP: string) {
    console.log("email", email, "hashP", hashP)
    const doctor = await this.doctorService.findByEmail(email);
    console.log(doctor);
   
    
    const check = await comparePasswords(hashP, doctor.password);
    if (check) {
      const doctorRes = { id: doctor.id, name: doctor.firstName, email: doctor.email };
      return doctorRes;
    } else return null;
  }
}



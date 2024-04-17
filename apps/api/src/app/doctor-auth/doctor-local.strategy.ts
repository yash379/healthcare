import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { DoctorAuthService } from './doctor-auth.service';

@Injectable()
export class DoctorLocalStrategy extends PassportStrategy(Strategy) {
  constructor(private doctorAuthService: DoctorAuthService) {
    super({
      usernameField: 'email',
    });
  }
  async validate(email: string, hashP: string) {
    console.log("email", email, "hashP", hashP)
    const doctor = await this.doctorAuthService.validateDoctor(email, hashP);
    if (!doctor) {
      throw new UnauthorizedException();
    }
    return doctor;
  }
}



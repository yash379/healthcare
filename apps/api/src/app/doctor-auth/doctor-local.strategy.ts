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
    const user = await this.doctorAuthService.validateUser(email, hashP);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}



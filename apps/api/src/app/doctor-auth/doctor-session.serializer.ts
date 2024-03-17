import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { Doctor } from '@prisma/client';

@Injectable()
export class DoctorSessionSerializer extends PassportSerializer {
  serializeUser(user: any, done: (err: Error, user: Doctor) => void) {
    done(null, user);
  }

  deserializeUser(payload: any, done: (err: Error, payload: any) => void) {
    done(null, payload);
  }
}

// import { Injectable } from '@nestjs/common';
// import { UsersService } from '../users/users.service';
// import { comparePasswords } from './bcrypt';

// @Injectable()
// export class AuthService {
//   constructor(private readonly userService: UsersService) {}

//   async validateUser(email: string, hashP: string) {
//     const user = await this.userService.findByEmail(email);
//     const check = await comparePasswords(hashP, user.password);
//     if (check) {
//       const userRes = { id: user.id, name: user.firstName, email: user.email };
//       return userRes;
//     } else return null;
//   }
// }


import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { DoctorsService } from '../doctors/doctors.service'; // Adjust path as needed
import { comparePasswords } from './bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly doctorService: DoctorsService,
  ) {}

  async validateUserOrDoctor(email: string, hashP: string, userType: 'user' | 'doctor') {
    let entity;
    let authService;

    if (userType === 'user') {
      entity = await this.userService.findByEmail(email);
      authService = this.userService;
    } else if (userType === 'doctor') {
      entity = await this.doctorService.findByEmail(email);
      authService = this.doctorService;
    }

    if (!entity) {
      return null; // User or Doctor not found
    }

    const check = await comparePasswords(hashP, entity.password);
    if (check) {
      const userOrDoctorRes = { id: entity.id, name: entity.name, email: entity.email };
      return userOrDoctorRes;
    } else {
      return null; // Passwords do not match
    }
  }
}

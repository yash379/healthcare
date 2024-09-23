import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { comparePasswords } from './bcrypt';
import { PrismaClient, SuperRoleName } from '@prisma/client';
import { UserDto } from '../users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}
  private prisma = new PrismaClient();
  
  async getUser(email: string): Promise<UserDto> {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email: { contains: email, mode: 'insensitive' } },
        select: {
          id: true,
          email: true,
          phoneNumber: true,
          firstName: true,
          lastName: true,
          isActive: true,
          superRoles: { select: { superRole: { select: { name: true } } } },
          doctor:{
            select:{
              id:true
            }
          },
          patient:{
            select:{
              id:true
            }
          },
          hospitalRoles: {
            select: {
              hospital: { select: { id: true, name: true } },
              hospitalRole: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
      if (!user) {
        throw new BadRequestException({
          message: 'Couldn`t find user with given email',
        });
      }
      if (!user.isActive) {
        throw new BadRequestException({
          message: 'Couldn`t find user with given email',
        });
      }
      const viewUser = {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
        doctorId:user.doctor ?
        user.doctor.id : undefined,
        patientId:user.patient ?
        user.patient.id : undefined,
        superRole:
          user.superRoles.length > 0
            ? (user.superRoles[0].superRole.name as SuperRoleName)
            : undefined,
  
        hospitalRoles: user.hospitalRoles.map((role) => ({
          hospitalId: role.hospital.id,
          hospitalName: role.hospital.name,
          hospitalRole: role.hospitalRole.name,
        })),
      };
      return viewUser;
    } catch (error) {
      // this.myLogger.error('Error while fetching user email', error);
      throw new BadRequestException({
        message: error.response.message,
      });
    }
  }

  async validateGoogleUser(user: any) {
    const { email } = user;

    const localUser = await this.prisma.user.findFirst({
      where: { email: { contains: email, mode: 'insensitive' } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        password: true,
        // role: true,
        isActive: true,
      },
    });

    if (!localUser || !localUser.isActive) {
      return null;
    }

    return {
      id: localUser.id,
      name: localUser.firstName,
      email: localUser.email,
    };
  }
  
  async validateUser(email: string, hashP: string) {
    const user =await this.userService.findByEmail(email);
    // const doctor = await this.doctorService.findByEmail(email);
    console.log(user);
    // console.log(doctor);
   
    
    const check = await comparePasswords(hashP, user.password);
    if (check) {
      const userRes = { id: user.id, name: user.firstName, email: user.email };
      return userRes;
    } else return null;
  }
}



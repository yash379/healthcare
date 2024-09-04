import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ManagerDto, UserDto } from './dto/user.dto';
import { ListUserPageDto } from './dto/list-user-page.dto';
import { AddManagerDto, AddUserDto } from './dto/add-user.dto';
import { HospitalRoleName, PrismaClient, SuperRoleName } from '@prisma/client';
import * as generatePassword from 'generate-password';
import { ListAllUserDto, ListUserDto } from './dto/list-user.dto';
import { EditUserStatus, ViewUserDto } from './dto/view-user.dto';
import { NotificationsService } from '../notifications/notifications.service';
import {
  ForgotPasswordDto,
  LoginDto,
  UpdatePasswordDto,
  UpdatePasswordThroughProfileDto,
} from '../core/dto/user-login.dto';
import { comparePasswords, encodePassword } from '../auth/bcrypt';
import * as ejs from 'ejs';
import * as fs from 'fs/promises';
import { ADMIN_URL, API_URL, HOSPITAL_URL } from '../core/consts/env.consts';
import { AddDoctorDto } from './dto/add-doctor.dto';
import { DoctorDto } from './dto/doctors.dto';
import { ListDoctorPageDto } from './dto/list-doctor-page.dto';
import { ListDoctorDto } from './dto/list-doctor.dto';
import { ViewDoctorDto } from './dto/view-doctor.dto';

@Injectable()
export class UsersService {
  constructor(private notificationService: NotificationsService) {}

  private prisma = new PrismaClient();

  generateRandomHexToken(length: number): string {
    const characters = '0123456789abcdef';
    let token = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters.charAt(randomIndex);
    }
    return token;
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: updatePasswordDto.email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.token != updatePasswordDto.token) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Invalid token',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: encodePassword(updatePasswordDto.password),
        token: null,
      },
    });

    const templateContent = await fs.readFile(
      'apps/api/src/assets/templates/update-password-template.ejs',
      'utf-8'
    );
    const message = ejs.render(templateContent, {
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
    });

    const sentMail = await this.notificationService.sendEmail(
      updatedUser.email,
      'Update Password',
      message
    );

    if (!sentMail)
      throw new HttpException(
        'there is some problem while sending mail',
        HttpStatus.INTERNAL_SERVER_ERROR
      );

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
    };
  }

  async editUserPassword(
    id: number,
    updatePassword: UpdatePasswordThroughProfileDto
  ): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    if (updatePassword.new_password == updatePassword.old_password)
      throw new HttpException(
        'Old password and new password should not be same',
        HttpStatus.BAD_REQUEST
      );
    if (!(await comparePasswords(updatePassword.old_password, user.password)))
      throw new HttpException('password not matched', HttpStatus.BAD_REQUEST);

    const updatedUser = await this.prisma.user.update({
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        firstName: true,
        lastName: true,
      },
      where: {
        id: id,
      },
      data: {
        password: encodePassword(updatePassword.new_password),
      },
    });

    return updatedUser;
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: forgotPasswordDto.email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = this.generateRandomHexToken(16);
    const updateUserToken = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        token: token,
      },
    });

    const resetPasswordLink = `${HOSPITAL_URL}/update-password/email/${updateUserToken.email}/token/${updateUserToken.token}`;

    const templateContent = await fs.readFile(
      'apps/api/src/assets/templates/forgot-password-template.ejs',
      'utf-8'
    );
    const message = ejs.render(templateContent, {
      firstName: updateUserToken.firstName,
      lastName: updateUserToken.lastName,
      resetPasswordLink: resetPasswordLink,
      loginLink: HOSPITAL_URL,
    });

    const sentMail = await this.notificationService.sendEmail(
      forgotPasswordDto.email,
      'Forgot Password',
      message
    );

    if (!sentMail)
      throw new HttpException(
        'there is some problem while sending mail',
        HttpStatus.INTERNAL_SERVER_ERROR
      );

    return;
  }

  async createAdminUser(createUserDto: AddUserDto): Promise<UserDto> {
    // TODO: add generated password functionlity with smtp configurations and email validation...

    const token = this.generateRandomHexToken(16);

    const data = { ...createUserDto, token };

    const user = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (user) {
      console.log('user already exist now adding the user admin role...');

      const is_user_super_relation = await this.prisma.userSuperRole.findFirst({
        where: {
          userId: user.id,
          superRoleId: 1,
        },
      });

      if (is_user_super_relation) {
        throw new HttpException(
          'user already exist with the super role',
          HttpStatus.BAD_REQUEST
        );
      }

      const user_super_relation = await this.prisma.userSuperRole.create({
        data: {
          userId: user.id,
          superRoleId: 1,
        },
      });

      if (!user_super_relation) {
        throw new HttpException(
          'some error while establishing relation between user and super',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      const templateContent = await fs.readFile(
        'apps/api/src/assets/templates/existing-admin-user-template.ejs',
        'utf-8'
      );

      const message = ejs.render(templateContent, {
        firstName: user.firstName,
        lastName: user.lastName,
        adminLoginLink: ADMIN_URL,
      });

      const sentMail = await this.notificationService.sendEmail(
        user.email,
        'You have been added in POYV Team',
        message
      );

      if (!sentMail)
        throw new HttpException(
          'there is some problem while sending mail',
          HttpStatus.INTERNAL_SERVER_ERROR
        );

      return {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        superRole: 'ADMIN',
      };
    }

    const { superRole, hospitalRoles, ...newData } = data;

    const newUser = await this.prisma.user.create({
      data: {
        ...newData,
        roles: SuperRoleName.ADMIN,
      },
    });

    if (!newUser) {
      throw new BadRequestException('Failed to create user.');
    }
    // add relation to the users_hospital_roles

    const user_super_relation = await this.prisma.userSuperRole.create({
      data: {
        userId: newUser.id,
        superRoleId: 1,
      },
    });

    if (!user_super_relation) {
      throw new HttpException(
        'some error while establishing relation between user and super',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    const resetPasswordLink = `${ADMIN_URL}/update-password/email/${newUser.email}/token/${token}`;

    const templateContent = await fs.readFile(
      'apps/api/src/assets/templates/new-admin-user-template.ejs',
      'utf-8'
    );

    const message = ejs.render(templateContent, {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      resetPasswordLink: resetPasswordLink,
      loginLink: ADMIN_URL,
    });

    const sentMail = await this.notificationService.sendEmail(
      newUser.email,
      'You have been added in Fountlab',
      message
    );

    if (!sentMail)
      throw new HttpException(
        'there is some problem while sending mail',
        HttpStatus.INTERNAL_SERVER_ERROR
      );

    return {
      id: newUser.id,
      email: newUser.email,
      phoneNumber: newUser.phoneNumber,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      superRole: superRole,
    };
  }

  isValidMobileNumber(mobileNumber: string): boolean {
    // Define a regex pattern for a 10-digit mobile number
    const pattern = /^[0-9]{10}$/;

    // Test the provided mobile number against the pattern
    return pattern.test(mobileNumber);
  }

  // async addDoctor(
  //   hospitalId: number,
  //   addDoctorDto: AddDoctorDto
  // ): Promise<DoctorDto> {
  //   if (Number.isNaN(hospitalId)) {
  //     throw new HttpException(
  //       'Hospital id is missing in params',
  //       HttpStatus.BAD_REQUEST
  //     );
  //   }

  //   const token = this.generateRandomHexToken(16);

  //   const data = { ...addDoctorDto, token };
  //   // Check if hospital exists
  //   const hospital = await this.prisma.hospital.findUnique({
  //     where: { id: hospitalId },
  //   });
  //   if (!hospital) {
  //     throw new HttpException(
  //       'Hospital not found, check hospitalId',
  //       HttpStatus.NOT_FOUND
  //     );
  //   }

  //   // Check if phone number is valid
  //   const isPhoneNumberValid = this.isValidMobileNumber(
  //     addDoctorDto.phoneNumber
  //   );
  //   if (!isPhoneNumberValid) {
  //     throw new HttpException(
  //       `${addDoctorDto.phoneNumber} is not a valid 10-digit mobile number.`,
  //       HttpStatus.BAD_REQUEST
  //     );
  //   }

  //   // Check if user with the email already exists
  //   let user = await this.prisma.user.findUnique({
  //     where: { email: addDoctorDto.email },
  //   });

  //   let isNewUser = false;

  //   if (!user) {
  //     isNewUser = true;
  //     // Create a new user if not exists
  //     user = await this.prisma.user.create({
  //       data: {
  //         email: addDoctorDto.email,
  //         phoneNumber: addDoctorDto.phoneNumber,
  //         firstName: addDoctorDto.firstName,
  //         lastName: addDoctorDto.lastName,
  //         // password: addDoctorDto.password, // assuming password is hashed
  //         role: HospitalRoleName.DOCTOR,
  //         isActive: addDoctorDto.isActive,
  //       },
  //     });
  //   }

  //   // Check if doctor already exists
  //   let doctor = await this.prisma.doctor.findUnique({
  //     where: { userId: user.id },
  //   });

  //   // If doctor doesn't exist, create a new one
  //   if (!doctor) {
  //     try{
  //     doctor = await this.prisma.doctor.create({
  //       data: {
  //         userId: user.id,
  //         gender: addDoctorDto.gender,
  //         doctorCode: addDoctorDto.doctorCode,
  //         speciality: addDoctorDto.speciality,
  //       },
  //     });
  //   }catch (error) {
  //     throw new HttpException('Failed to create doctor.', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }

  //   } else {
  //     // Check if doctor is already associated with the hospital in DoctorHospital table
  //     const existingDoctorHospital =
  //       await this.prisma.doctorHospital.findUnique({
  //         where: {
  //           doctorId_hospitalId: {
  //             doctorId: doctor.id,
  //             hospitalId: hospitalId,
  //           },
  //         },
  //       });

  //     if (existingDoctorHospital) {
  //       throw new HttpException(
  //         'Doctor is already associated with this hospital',
  //         HttpStatus.BAD_REQUEST
  //       );
  //     }

  //     // Create association in the DoctorHospital table
  //     try {
  //       await this.prisma.doctorHospital.create({
  //         data: {
  //           doctorId: doctor.id,
  //           hospitalId: hospitalId,
  //         },
  //       });
  //     } catch (error) {
  //       throw new HttpException(
  //         'Failed to associate doctor with hospital.',
  //         HttpStatus.INTERNAL_SERVER_ERROR
  //       );
  //     }

  //     const resetPasswordLink = `${ADMIN_URL}/update-password/email/${addDoctorDto.email}/token/${token}`;
  //     if (isNewUser) {
  //       const templateContent = await fs.readFile(
  //         'apps/api/src/assets/templates/new-doctor-template.ejs',
  //         'utf-8'
  //       );

  //       const message = ejs.render(templateContent, {
  //         firstName: addDoctorDto.firstName,
  //         lastName: addDoctorDto.lastName,
  //         resetPasswordLink: resetPasswordLink,
  //         loginLink: ADMIN_URL,
  //       });

  //       const sentMail = await this.notificationService.sendEmail(
  //         addDoctorDto.email,
  //         `You have been added in ${hospital.name}`,
  //         message
  //       );
  //       if (!sentMail)
  //         throw new HttpException(
  //           'there is some problem while sending mail',
  //           HttpStatus.INTERNAL_SERVER_ERROR
  //         );
  //     } else {
  //       const templateContent = await fs.readFile(
  //         'apps/api/src/assets/templates/existing-doctor-template.ejs',
  //         'utf-8'
  //       );

  //       const message = ejs.render(templateContent, {
  //         firstName: user.firstName,
  //         lastName: user.lastName,
  //         adminLoginLink: ADMIN_URL,
  //       });

  //       const sentMail = await this.notificationService.sendEmail(
  //         user.email,
  //         `You have been added in ${hospital.name}`,
  //         message
  //       );

  //       if (!sentMail)
  //         throw new HttpException(
  //           'there is some problem while sending mail',
  //           HttpStatus.INTERNAL_SERVER_ERROR
  //         );
  //     }
  //   }
  //   // // Create association in the DoctorHospital table
  //   // await this.prisma.doctorHospital.create({
  //   //   data: {
  //   //     doctorId: doctor.id,
  //   //     hospitalId: hospitalId,
  //   //   },
  //   // });

  //   // Return doctor details
  //   return {
  //     id: doctor.id,
  //     firstName: user.firstName,
  //     lastName: user.lastName,
  //     email: user.email,
  //     phoneNumber: user.phoneNumber,
  //     speciality: doctor.speciality,
  //     gender: doctor.gender,
  //     doctorCode: doctor.doctorCode,
  //     isActive: user.isActive,
  //   };
  // }

  async addManager(
    hospitalId: number,
    addManagerDto: AddManagerDto & {
      isPrimary: boolean;
    }
  ): Promise<
    ManagerDto & {
      isPrimary: boolean;
    }
  > {
    if (Number.isNaN(hospitalId)) {
      throw new HttpException(
        'Hospital id is missing in params',
        HttpStatus.BAD_REQUEST
      );
    }

    const token = this.generateRandomHexToken(16);

    const data = { ...addManagerDto, token };

    // Check if hospital exists
    const hospital = await this.prisma.hospital.findUnique({
      where: { id: hospitalId },
    });
    if (!hospital) {
      throw new HttpException(
        'Hospital not found, check hospitalId',
        HttpStatus.NOT_FOUND
      );
    }

    // Check if phone number is valid
    const isPhoneNumberValid = this.isValidMobileNumber(
      addManagerDto.phoneNumber
    );
    if (!isPhoneNumberValid) {
      throw new HttpException(
        `${addManagerDto.phoneNumber} is not a valid 10-digit mobile number.`,
        HttpStatus.BAD_REQUEST
      );
    }

    // Check if user with the email already exists
    let user = await this.prisma.user.findUnique({
      where: { email: addManagerDto.email },
    });

    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      // Create a new user if not exists
      user = await this.prisma.user.create({
        data: {
          email: addManagerDto.email,
          phoneNumber: addManagerDto.phoneNumber,
          firstName: addManagerDto.firstName,
          lastName: addManagerDto.lastName,
          roles: HospitalRoleName.ADMIN,
          // isActive: addManagerDto.isActive,
          token: token,
        },
      });
    }

    // Check if admin already exists
    let admin = await this.prisma.hospitalAdmin.findUnique({
      where: { userId: user.id },
    });

    // If admin doesn't exist, create a new one
    if (!admin) {
      try {
        admin = await this.prisma.hospitalAdmin.create({
          data: {
            userId: user.id,
          },
        });
      } catch (error) {
        console.error('Error creating manager:', error);
        throw new HttpException(
          'Failed to create manager.',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }

    // Check if admin is already associated with the hospital in ManagerHospital table
    const existingManagerHospital =
      await this.prisma.hospitalAdminHospital.findUnique({
        where: {
          hospitalAdminId_hospitalId: {
            hospitalAdminId: admin.id,
            hospitalId: hospitalId,
          },
        },
      });

    if (existingManagerHospital) {
      throw new HttpException(
        'Manager is already associated with this hospital',
        HttpStatus.BAD_REQUEST
      );
    }

    // Create association in the ManagerHospital table
    try {
      await this.prisma.hospitalAdminHospital.create({
        data: {
          hospitalAdminId: admin.id,
          hospitalId: hospitalId,
        },
      });
    } catch (error) {
      console.error('Error associating admin with hospital:', error);
      throw new HttpException(
        'Failed to associate admin with hospital.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    // Create association in the UserHospitalRole table
    try {
      const adminHospitalRelation = await this.prisma.userHospitalRole.create({
        data: {
          userId: user.id,
          hospitalId: hospitalId,
          hospitalRoleId: 1, // Assuming the role ID for 'DOCTOR' is 1
          isPrimary: addManagerDto.isPrimary,
        },
      });

      if (!adminHospitalRelation) {
        throw new HttpException(
          'Some error while establishing relation between user and hospital',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    } catch (error) {
      console.error('Error creating UserHospitalRole:', error);
      throw new HttpException(
        'Failed to create user-hospital role association.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    if (addManagerDto.isPrimary) {
      // set others with same role in the same hospital as not primary
      await this.prisma.userHospitalRole.updateMany({
        where: {
          hospitalId: hospitalId,
          hospitalRoleId: 1,
          userId: { not: user.id },
        },
        data: { isPrimary: false },
      });
    }

    const resetPasswordLink = `${ADMIN_URL}/update-password/email/${addManagerDto.email}/token/${token}`;
    if (isNewUser) {
      const templateContent = await fs.readFile(
        'apps/api/src/assets/templates/new-manager-template.ejs',
        'utf-8'
      );

      const message = ejs.render(templateContent, {
        firstName: addManagerDto.firstName,
        lastName: addManagerDto.lastName,
        hospitalName: hospital.name,
        resetPasswordLink: resetPasswordLink,
        loginLink: ADMIN_URL,
      });

      const sentMail = await this.notificationService.sendEmail(
        addManagerDto.email,
        'You have been added in ' + hospital.name,
        message
      );
      if (!sentMail)
        throw new HttpException(
          'There is some problem while sending mail',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
    } else {
      const templateContent = await fs.readFile(
        'apps/api/src/assets/templates/existing-manager-template.ejs',
        'utf-8'
      );

      const message = ejs.render(templateContent, {
        firstName: user.firstName,
        lastName: user.lastName,
        hospitalName: hospital.name,
        adminLoginLink: ADMIN_URL,
      });

      const sentMail = await this.notificationService.sendEmail(
        user.email,
        'You have been added in ' + hospital.name,
        message
      );

      if (!sentMail)
        throw new HttpException(
          'There is some problem while sending mail',
          HttpStatus.INTERNAL_SERVER_ERROR
        );

      if (addManagerDto.isPrimary) {
        // set others with same role in the same hospital as not primary
        await this.prisma.userHospitalRole.updateMany({
          where: {
            hospitalId: hospitalId,
            hospitalRoleId: 1,
            userId: { not: user.id },
          },
          data: { isPrimary: false },
        });
      }
    }

    return {
      id: admin.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isPrimary: addManagerDto.isPrimary,
    };
  }

  async updateManager(
    hospitalId: number,
    userId: number,
    updateManagerDto: AddManagerDto & { isPrimary?: boolean }
  ): Promise<ManagerDto & { isPrimary: boolean }> {
    if (Number.isNaN(hospitalId)) {
      throw new HttpException(
        'Hospital id is missing in params',
        HttpStatus.BAD_REQUEST
      );
    }

    if (Number.isNaN(userId)) {
      throw new HttpException(
        'User id is missing in params',
        HttpStatus.BAD_REQUEST
      );
    }

    // Check if hospital exists
    const hospital = await this.prisma.hospital.findUnique({
      where: { id: hospitalId },
    });
    if (!hospital) {
      throw new HttpException(
        'Hospital not found, check hospitalId',
        HttpStatus.NOT_FOUND
      );
    }

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new HttpException(
        'User not found, check userId',
        HttpStatus.NOT_FOUND
      );
    }

    // Update user details
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: updateManagerDto.firstName ?? user.firstName,
        lastName: updateManagerDto.lastName ?? user.lastName,
        phoneNumber: updateManagerDto.phoneNumber ?? user.phoneNumber,
        email: updateManagerDto.email ?? user.email,
      },
    });

    // Find the UserHospitalRole entry
    const userHospitalRole = await this.prisma.userHospitalRole.findUnique({
      where: {
        userId_hospitalRoleId: {
          userId: userId,
          hospitalRoleId: 1, // Use the correct key here
        },
      },
    });

    if (userHospitalRole) {
      // Update UserHospitalRole
      await this.prisma.userHospitalRole.update({
        where: {
          userId_hospitalRoleId: {
            userId: userId,
            hospitalRoleId: userHospitalRole.hospitalRoleId, // Make sure you use correct `hospitalRoleId`
          },
        },
        data: {
          isPrimary: updateManagerDto.isPrimary ?? userHospitalRole.isPrimary,
        },
      });

      // If updating to primary, set others to not primary
      if (updateManagerDto.isPrimary) {
        await this.prisma.userHospitalRole.updateMany({
          where: {
            hospitalId: hospitalId,
            hospitalRoleId: userHospitalRole.hospitalRoleId,
            userId: { not: userId },
          },
          data: { isPrimary: false },
        });
      }
    } else {
      throw new HttpException(
        'User is not associated with the specified hospital',
        HttpStatus.BAD_REQUEST
      );
    }

    return {
      id: userId,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      isPrimary: updateManagerDto.isPrimary ?? userHospitalRole.isPrimary,
    };
  }

  // async create(
  //   hospitalId: number,
  //   createUserDto: AddUserDto & {
  //     isPrimary: boolean;
  //   }
  // ): Promise<
  //   UserDto & {
  //     isPrimary: boolean;
  //   }
  // > {
  //   // TODO: add generated password functionlity with smtp configurations and email validation...

  //   const token = this.generateRandomHexToken(16);

  //   const data = { ...createUserDto, token };

  //   const hospital = await this.prisma.hospital.findFirst({
  //     where: {
  //       id: hospitalId,
  //     },
  //   });
  //   if (!hospital) {
  //     throw new HttpException(
  //       'hospital with id' + hospitalId + ' not exist',
  //       HttpStatus.BAD_REQUEST
  //     );
  //   }

  //   const user = await this.prisma.user.findUnique({
  //     where: {
  //       email: createUserDto.email,
  //     },
  //   });

  //   // if (user) {
  //   //   throw new HttpException(
  //   //     {
  //   //       status: HttpStatus.BAD_REQUEST,
  //   //       error: 'User already exists',
  //   //     },
  //   //     HttpStatus.BAD_REQUEST
  //   //   );
  //   // }

  //   if (!user) {
  //     const { superRole, hospitalRoles, isPrimary, ...newData } = data;

  //     const newUser = await this.prisma.user.create({
  //       data: newData,
  //     });

  //     if (!newUser) {
  //       throw new BadRequestException('Failed to create user.');
  //     }
  //     // add relation to the users_hospital_roles

  //     const user_hospital_relation = await this.prisma.userHospitalRole.create({
  //       data: {
  //         userId: newUser.id,
  //         hospitalId: hospitalId,
  //         hospitalRoleId: 1,
  //         isPrimary: isPrimary,
  //       },
  //     });

  //     if (!user_hospital_relation) {
  //       throw new HttpException(
  //         'some error while establishing relation between user and hospital',
  //         HttpStatus.INTERNAL_SERVER_ERROR
  //       );
  //     }

  //     if (isPrimary) {
  //       // set others with same role in the same hospital as not primary
  //       await this.prisma.userHospitalRole.updateMany({
  //         where: {
  //           hospitalId: hospitalId,
  //           hospitalRoleId: 1,
  //           userId: { not: newUser.id },
  //         },
  //         data: { isPrimary: false },
  //       });
  //     }

  //     const resetPasswordLink = `${HOSPITAL_URL}/update-password/email/${newUser.email}/token/${token}`;

  //     const templateContent = await fs.readFile(
  //       'apps/api/src/assets/templates/new-manager-template.ejs',
  //       'utf-8'
  //     );

  //     const message = ejs.render(templateContent, {
  //       firstName: newUser.firstName,
  //       lastName: newUser.lastName,
  //       hospitalName: hospital.name,
  //       resetPasswordLink: resetPasswordLink,
  //       loginLink: HOSPITAL_URL,
  //     });

  //     const sentMail = await this.notificationService.sendEmail(
  //       newUser.email,
  //       'You have been added in ' + hospital.name,
  //       message
  //     );

  //     if (!sentMail)
  //       throw new HttpException(
  //         'there is some problem while sending mail',
  //         HttpStatus.INTERNAL_SERVER_ERROR
  //       );

  //     return {
  //       id: newUser.id,
  //       email: newUser.email,
  //       phoneNumber: newUser.phoneNumber,
  //       firstName: newUser.firstName,
  //       lastName: newUser.lastName,
  //       hospitalRole: hospitalRole,
  //       isPrimary: isPrimary,
  //     };
  //   } else {
  //     const {
  //       superRole,
  //       hospitalRoles,
  //       hospitalRole,
  //       isPrimary,
  //       ...newData
  //     } = data;
  //     const user_hospital_relation =
  //       await this.prisma.userHospitalRole.findFirst({
  //         where: {
  //           userId: user.id,
  //           hospitalId: hospitalId,
  //         },
  //       });

  //     if (user_hospital_relation) {
  //       throw new HttpException(
  //         'user already present as manager for hospital',
  //         HttpStatus.BAD_REQUEST
  //       );
  //     }

  //     const new_user_hospital_relation =
  //       await this.prisma.userHospitalRole.create({
  //         data: {
  //           userId: user.id,
  //           hospitalId: hospitalId,
  //           hospitalRoleId: 1,
  //           isPrimary: isPrimary,
  //         },
  //       });

  //     const templateContent = await fs.readFile(
  //       'apps/api/src/assets/templates/existing-manager-template.ejs',
  //       'utf-8'
  //     );

  //     const message = ejs.render(templateContent, {
  //       firstName: user.firstName,
  //       lastName: user.lastName,
  //       hospitalName: hospital.name,
  //       loginLink: HOSPITAL_URL,
  //     });

  //     const sentMail = await this.notificationService.sendEmail(
  //       user.email,
  //       'You have been added in ' + hospital.name,
  //       message
  //     );

  //     if (!sentMail)
  //       throw new HttpException(
  //         'there is some problem while sending mail',
  //         HttpStatus.INTERNAL_SERVER_ERROR
  //       );

  //     if (isPrimary) {
  //       // set others with same role in the same hospital as not primary
  //       await this.prisma.userHospitalRole.updateMany({
  //         where: {
  //           hospitalId: hospitalId,
  //           hospitalRoleId: 1,
  //           userId: { not: user.id },
  //         },
  //         data: { isPrimary: false },
  //       });
  //     }

  //     return {
  //       id: user.id,
  //       email: user.email,
  //       phoneNumber: user.phoneNumber,
  //       firstName: user.firstName,
  //       lastName: user.lastName,
  //       hospitalRole: hospitalRole,
  //       isPrimary: isPrimary,
  //     };
  //   }
  // }

  async listAdmins(
    pageSize: number,
    pageOffset: number,
    name: string,
    email: string,
    sortBy: string,
    sortOrder: 'asc' | 'desc'
  ): Promise<ListUserPageDto> {
    const hospitalAdminRoleId = await this.prisma.hospitalRole.findFirst({
      where: {
        name: SuperRoleName.ADMIN,
      },
    });
    const whereArray = [];
    let whereQuery = {};
    whereArray.push({
      superRoles: {
        some: {
          superRoleId: hospitalAdminRoleId.id,
        },
      },
    });

    if (email !== undefined) {
      whereArray.push({ email: { contains: email, mode: 'insensitive' } });
    }

    if (name !== undefined) {
      whereArray.push({
        OR: [
          { firstName: { contains: name, mode: 'insensitive' } },
          { lastName: { contains: name, mode: 'insensitive' } },
        ],
      });
    }
    if (whereArray.length > 0) {
      if (whereArray.length > 1) {
        whereQuery = { AND: whereArray };
      } else {
        whereQuery = whereArray[0];
      }
    }

    const sort = (sortBy ? sortBy : 'id').toString();
    const order = sortOrder ? sortOrder : 'asc';
    const size = pageSize ? pageSize : 10;
    const offset = pageOffset ? pageOffset : 0;
    const orderBy = { [sort]: order };
    const count = await this.prisma.user.count({
      where: whereQuery,
    });

    const listusers = await this.prisma.user.findMany({
      where: whereQuery,
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        firstName: true,
        isActive: true,
        lastName: true,
        hospitalRoles: {
          select: {
            hospital: { select: { name: true } },
            hospitalRole: { select: { name: true } },
          },
        },
        superRoles: { select: { superRole: { select: { name: true } } } },
      },
      take: Number(size),
      skip: Number(size * offset),
      orderBy,
    });

    const listUsers = await this.getList(listusers);

    return {
      size: size,
      number: offset,
      total: count,
      sort: [
        {
          by: sort,
          order: order,
        },
      ],
      content: listUsers,
    };
    // return await this.prisma.userSuperRole.findMany({
    //   select:{
    //     id: true,
    //     superRole:{
    //       select:{
    //         name: true
    //       }
    //     },
    //     user: {
    //       select: {
    //         id: true,
    //         firstName: true,
    //         lastName: true,
    //         phoneNumber: true,
    //         email: true,
    //       },
    //     },
    //   }
    // })
  }

  async listMangers(hospitalId: number) {
    return await this.prisma.userHospitalRole.findMany({
      where: {
        hospitalId: hospitalId,
        hospitalRole: {
          name: HospitalRoleName.ADMIN,
        },
      },
      select: {
        userId: true,
        hospitalRole: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            email: true,
          },
        },
        isPrimary: true,
      },
    });
  }

  // async listMangers(hospitalId: number) {
  //   return await this.prisma.hospitalAdmin.findMany({
  //     where: {
  //       hospitals: {
  //         some: {
  //           hospitalId: hospitalId,
  //         },
  //       },
  //     },
  //     select: {
  //       user: {
  //         select: {
  //           id: true,
  //           firstName: true,
  //           lastName: true,
  //           phoneNumber: true,
  //           email: true,
  //         },
  //       },
  //       // Optionally include any other fields if needed
  //       createdAt: true,
  //       updatedAt: true,
  //     },
  //   });
  // }

  async getAdminCounts(): Promise<{
    total: number;
    active: number;
    inactive: number;
  }> {
    const hospitalAdminRoleId = await this.prisma.hospitalRole.findFirst({
      where: {
        name: SuperRoleName.ADMIN,
      },
      select: {
        id: true,
      },
    });

    const total = await this.prisma.user.count({
      where: {
        superRoles: {
          some: {
            superRoleId: hospitalAdminRoleId.id,
          },
        },
      },
    });

    const active = await this.prisma.user.count({
      where: {
        superRoles: {
          some: {
            superRoleId: hospitalAdminRoleId.id,
          },
        },
        isActive: true,
      },
    });

    const inactive = await this.prisma.user.count({
      where: {
        superRoles: {
          some: {
            superRoleId: hospitalAdminRoleId.id,
          },
        },
        isActive: false,
      },
    });

    return {
      total,
      active,
      inactive,
    };
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
      select: { id: true, email: true, password: true, firstName: true },
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async findById(id: number): Promise<
    ViewUserDto & {
      isPrimary: boolean;
    }
  > {
    const user = await this.prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        firstName: true,
        lastName: true,
        isActive: true,
        hospitalRoles: {
          select: {
            hospital: { select: { name: true } },
            hospitalRole: { select: { name: true } },
          },
        },
        superRoles: { select: { superRole: { select: { name: true } } } },
      },
    });
    if (!user) {
      throw new NotFoundException();
    } else {
      const viewUser = {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
        //TODO: check primary status
        isPrimary: false,
        hospitalRoles: user.hospitalRoles.map((role) => ({
          name: role.hospital.name,
          hospitalRole: role.hospitalRole.name,
        })),
        superRole:
          user.superRoles.length > 0
            ? (user.superRoles[0].superRole.name as SuperRoleName)
            : undefined,
      };
      return viewUser;
    }
  }

  async findByIdForSwitch(id: number): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        firstName: true,
        lastName: true,
        isActive: true,
        superRoles: { select: { superRole: { select: { name: true } } } },

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
    console.log(user);
    if (!user) {
      throw new NotFoundException();
    }
    if (!user.isActive)
      throw new HttpException('user is inactive', HttpStatus.BAD_REQUEST);

    const viewUser = {
      id: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
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
  }

  async editUserStatus(id: number, editUserStatus: EditUserStatus) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
      },
    });
    if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

    const editedUser = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        isActive: editUserStatus.isActive,
      },
    });

    const templateContent = await fs.readFile(
      'apps/api/src/assets/templates/deactivate-admin-user.ejs',
      'utf-8'
    );

    const message = ejs.render(templateContent, {
      firstName: user.firstName,
      lastName: user.lastName,
    });

    const sentMail = await this.notificationService.sendEmail(
      user.email,
      'You have been removed from Fountlab',
      message
    );

    if (!sentMail)
      throw new HttpException(
        'there is some problem while sending mail',
        HttpStatus.INTERNAL_SERVER_ERROR
      );

    return editUserStatus;
  }

  // async edit(
  //   userDto: AddUserDto & {
  //     isPrimary: boolean;
  //   },
  //   hospitalId: number,
  //   id: number
  // ): Promise<
  //   UserDto & {
  //     isPrimary: boolean;
  //   }
  // > {
  //   let transaction;
  //   try {
  //     transaction = await this.prisma.$transaction(async (prisma) => {
  //       const checkUser = await this.findById(id);
  //       if (!checkUser) {
  //         throw new NotFoundException();
  //       }

  //       //check hospital
  //       const hospital = await prisma.hospital.findFirst({
  //         where: {
  //           id: hospitalId,
  //         },
  //       });
  //       if (!hospital) {
  //         throw new HttpException('hospital not found ', HttpStatus.BAD_REQUEST);
  //       }
  //       //check user

  //       const user = await prisma.user.findUnique({
  //         where: {
  //           email: userDto.email,
  //         },
  //       });

  //       if (user && user.id != id) {
  //         throw new HttpException(
  //           'User with same email already exists',
  //           HttpStatus.BAD_REQUEST
  //         );
  //       }

  //       const data = userDto;
  //       const {
  //         superRole,
  //         hospitalRoles,
  //         hospitalRole,
  //         isPrimary,
  //         ...newData
  //       } = data;

  //       // if (
  //       //   !superRole &&
  //       //   (!hospitalRoles || hospitalRoles.length === 0)
  //       // ) {
  //       //   throw new BadRequestException();
  //       // }

  //       const updateuser = await prisma.user.update({
  //         where: { id: id },
  //         data: newData,
  //       });
  //       await this.prisma.userHospitalRole.updateMany({
  //         where: { userId: updateuser.id, hospitalId: hospitalId },
  //         data: { isPrimary: isPrimary },
  //       });
  //       if (isPrimary) {
  //         // set others with same role in the same hospital as not primary
  //         await this.prisma.userHospitalRole.updateMany({
  //           where: {
  //             hospitalId: hospitalId,
  //             hospitalRoleId: 1,
  //             userId: { not: updateuser.id },
  //           },
  //           data: { isPrimary: false },
  //         });
  //       }

  //       // const superRoleInDatabase = await prisma.userSuperRole.findFirst({
  //       //   where: { userId: id },
  //       // });
  //       // const hospitalRolesinDatabase =
  //       //   await this.prisma.userHospitalRole.findMany({
  //       //     where: { userId: user.id },
  //       //   });

  //       // if (superRoleInDatabase) {
  //       //   if (!superRole)
  //       //     await prisma.userSuperRole.delete({
  //       //       where: { id: superRoleInDatabase.id },
  //       //     });
  //       // }

  //       // if (superRole) {
  //       //   const fntrole = await prisma.superRole.findFirst({
  //       //     where: { name: superRole },
  //       //   });
  //       //   const role = await prisma.userSuperRole.findFirst({
  //       //     where: { userId: id, superRoleId: fntrole.id },
  //       //   });
  //       //   if (!role) {
  //       //     await prisma.userSuperRole.create({
  //       //       data: { userId: id, superRoleId: fntrole.id },
  //       //     });
  //       //   }
  //       // }

  //       // const rolesPresentInDb = [];

  //       // if (hospitalRoles && hospitalRoles.length > 0) {
  //       //   for (const org of hospitalRoles) {
  //       //     const { hospitalId, hospitalRole } = org;

  //       //     if (!hospitalId) {
  //       //       throw new BadRequestException();
  //       //     }

  //       //     const orgCheck = await prisma.hospital.findFirst({
  //       //       where: { id: hospitalId },
  //       //     });

  //       //     if (!orgCheck) {
  //       //       throw new BadRequestException();
  //       //     }
  //       //     if (!hospitalRole) {
  //       //       throw new BadRequestException();
  //       //     }

  //       //     const orgrole = await prisma.hospitalRole.findFirst({
  //       //       where: { name: { equals: hospitalRole } },
  //       //     });

  //       //     const role = await prisma.userHospitalRole.findFirst({
  //       //       where: {
  //       //         userId: id,
  //       //         hospitalRoleId: orgrole.id,
  //       //         hospitalId: hospitalId,
  //       //       },
  //       //     });

  //       //     if (role) {
  //       //       rolesPresentInDb.push(role);
  //       //     }

  //       //     if (!role) {
  //       //       await prisma.userHospitalRole.create({
  //       //         data: {
  //       //           userId: id,
  //       //           hospitalRoleId: orgrole.id,
  //       //           hospitalId: hospitalId,
  //       //         },
  //       //       });
  //       //     }
  //       //   }
  //       // }

  //       // const rolesPrsentInList = [];
  //       // rolesPresentInDb.forEach((value) => rolesPrsentInList.push(value.id));
  //       // const rolesPrsentinDb = [];
  //       // hospitalRolesinDatabase.forEach((value) =>
  //       //   rolesPrsentinDb.push(value.id)
  //       // );
  //       // // add here
  //       // const missing = rolesPrsentinDb.filter(
  //       //   (item) => rolesPrsentInList.indexOf(item) < 0
  //       // );

  //       // if (missing && missing.length > 0) {
  //       //   await prisma.userHospitalRole.deleteMany({
  //       //     where: { id: { in: missing } },
  //       //   });
  //       // }
  //       const updatedUser: UserDto & {
  //         isPrimary: boolean;
  //       } = {
  //         id: updateuser.id,
  //         email: updateuser.email,
  //         phoneNumber: updateuser.phoneNumber,
  //         firstName: updateuser.firstName,
  //         lastName: updateuser.lastName,
  //         hospitalRoles: hospitalRoles,
  //         superRole: superRole,
  //         isPrimary,
  //       };

  //       return updatedUser;
  //     });
  //   } catch (error) {
  //     // Handle transaction failure
  //     console.log(error);
  //     throw new BadRequestException('Failed to edit user.');
  //   }

  //   return transaction;
  // }

  async deleteUser(hospitalId: number, id: number): Promise<void> {
    const checkUser = await this.findById(id);
    if (!checkUser) {
      throw new NotFoundException();
    }
    const hospitalUserRelation = await this.prisma.userHospitalRole.findFirst({
      where: {
        hospitalId: hospitalId,
        userId: id,
      },
    });

    // if (hospitalUserRelation)
    //   await this.prisma.userHospitalRole.delete({
    //     where: { 
    //      userId_hospitalRoleId: {
    //       userId: hospitalUserRelation.userId,
    //       hospitalId:hospitalUserRelation.userId
    //      } 
    //     }
    //   });

    if (hospitalUserRelation) {
      await this.prisma.userHospitalRole.delete({
        where: { 
          userId_hospitalRoleId: {
            userId: hospitalUserRelation.userId,
            hospitalRoleId: 1, // Correct the property name
          } 
        }
      });
    }
    

    const templateContent = await fs.readFile(
      'apps/api/src/assets/templates/deactivate-manager.ejs',
      'utf-8'
    );

    const message = ejs.render(templateContent, {
      firstName: checkUser.firstName,
      lastName: checkUser.lastName,
    });

    const sentMail = await this.notificationService.sendEmail(
      checkUser.email,
      'You have been removed from hospital ',
      message
    );

    if (!sentMail)
      throw new HttpException(
        'there is some problem while sending mail',
        HttpStatus.INTERNAL_SERVER_ERROR
      );

    console.log('removed user...');
    return;
  }

  async editAdmin(userDto: AddUserDto, id: number): Promise<UserDto> {
    let transaction;
    try {
      transaction = await this.prisma.$transaction(async (prisma) => {
        const checkUser = await this.findById(id);
        if (!checkUser) {
          throw new NotFoundException();
        }
        //check user

        const user = await prisma.user.findUnique({
          where: {
            email: userDto.email,
          },
        });

        if (user && user.id != id) {
          throw new HttpException(
            'User with same email already exists',
            HttpStatus.BAD_REQUEST
          );
        }

        const data = userDto;
        const { superRole, hospitalRoles, ...newData } = data;

        const updateuser = await prisma.user.update({
          where: { id: id },
          data: newData,
        });

        const updatedUser: UserDto = {
          id: updateuser.id,
          email: updateuser.email,
          phoneNumber: updateuser.phoneNumber,
          firstName: updateuser.firstName,
          lastName: updateuser.lastName,
          hospitalRoles: hospitalRoles,
          superRole: superRole,
        };

        return updatedUser;
      });
    } catch (error) {
      // Handle transaction failure
      console.log(error);
      throw new BadRequestException('Failed to edit user.');
    }

    return transaction;
  }

  async deleteAdminUser(id: number): Promise<void> {
    const checkUser = await this.findById(id);
    if (!checkUser) {
      throw new NotFoundException();
    } else {
      const superUserRelation = await this.prisma.userSuperRole.findFirst({
        where: {
          userId: id,
        },
      });
      await this.prisma.userSuperRole.delete({
        where: {
          id: superUserRelation.id,
        },
      });
      await this.prisma.user.delete({ where: { id: Number(id) } });
      return;
    }
  }

  // async getFilteredPosts(
  //   pageSize: number,
  //   pageOffset: number,
  //   name: string,
  //   email: string,
  //   sortBy: string,
  //   sortOrder: 'asc' | 'desc'
  // ): Promise<ListUserPageDto> {
  //   const whereArray = [];
  //   let whereQuery = {};

  //   if (email !== undefined) {
  //     whereArray.push({ email: { contains: email, mode: 'insensitive' } });
  //   }

  //   if (name !== undefined) {
  //     whereArray.push({
  //       OR: [
  //         { firstName: { contains: name, mode: 'insensitive' } },
  //         { lastName: { contains: name, mode: 'insensitive' } },
  //       ],
  //     });
  //   }
  //   if (whereArray.length > 0) {
  //     if (whereArray.length > 1) {
  //       whereQuery = { AND: whereArray };
  //     } else {
  //       whereQuery = whereArray[0];
  //     }
  //   }

  //   const sort = (sortBy ? sortBy : 'id').toString();
  //   const order = sortOrder ? sortOrder : 'asc';
  //   const size = pageSize ? pageSize : 10;
  //   const offset = pageOffset ? pageOffset : 0;
  //   const orderBy = { [sort]: order };
  //   const count = await this.prisma.user.count({
  //     where: whereQuery,
  //   });

  //   const listusers = await this.prisma.user.findMany({
  //     where: whereQuery,
  //     select: {
  //       id: true,
  //       email: true,
  //       phoneNumber: true,
  //       firstName: true,
  //       lastName: true,
  //       hospitalRoles: {
  //         select: {
  //           hospital: { select: { name: true } },
  //           hospitalRole: { select: { name: true } },
  //         },
  //       },
  //       superRoles: { select: { superRole: { select: { name: true } } } },
  //     },
  //     take: Number(size),
  //     skip: Number(size * offset),
  //     orderBy,
  //   });

  //   const listUsers = await this.getList(listusers);

  //   return {
  //     size: size,
  //     number: offset,
  //     total: count,
  //     sort: [
  //       {
  //         by: sort,
  //         order: order,
  //       },
  //     ],
  //     content: listUsers,
  //   };
  // }

  private getList(listuser): Promise<ListUserDto[]> {
    if (!listuser) {
      throw new BadRequestException();
    } else {
      return listuser.map((user) => ({
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
        hospitalRoles: user.hospitalRoles.map((role) => ({
          name: role.hospital.name,
          hospitalRole: role.hospitalRole.name,
        })),
        superRole:
          user.superRoles.length > 0
            ? (user.superRoles[0].superRole.name as SuperRoleName)
            : undefined,
      }));
    }
  }

  async getUserList(name, email, phoneNumber): Promise<ListAllUserDto[]> {
    try {
      const whereArray = [];

      let whereQuery = {};

      if (whereArray.length > 0) {
        if (whereArray.length > 1) {
          whereQuery = { AND: whereArray };
        } else {
          whereQuery = whereArray[0];
        }
      }

      if (name !== undefined && name.trim() !== '') {
        // Split name into first and last names based on space
        const nameParts = name.trim().split(/\s+/);
        const firstName = nameParts[0];
        const lastName =
          nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

        whereArray.push({
          OR: [
            {
              AND: [
                { firstName: { contains: firstName, mode: 'insensitive' } },
                { lastName: { contains: lastName, mode: 'insensitive' } },
              ],
            },
            { firstName: { contains: name, mode: 'insensitive' } },
            { lastName: { contains: name, mode: 'insensitive' } },
          ],
        });
      }
      
      if (phoneNumber) {
        whereArray.push({
          phoneNumber: { contains: phoneNumber, mode: 'insensitive' },
        });
      }

      if (email) {
        whereArray.push({ email: { contains: email, mode: 'insensitive' } });
      }
      const listusers = await this.prisma.user.findMany({
        where: whereQuery,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          isActive: true,
        },
        orderBy: { firstName: 'asc' },
      });

      return listusers;
    } catch (error) {
      throw new BadRequestException({
        message: error.response.message,
      });
    }
  }

  // private generateRandomPassword(length: number): string {
  //   const password = generatePassword.generate({
  //     length,
  //     numbers: true,
  //     symbols: true,
  //     uppercase: true,
  //     excludeSimilarCharacters: true,
  //   });
  //   return password;
  // }
}

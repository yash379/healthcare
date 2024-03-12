import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AssetCountDashboardDto, UserDto } from './dto/user.dto';
import { ListUserPageDto } from './dto/list-user-page.dto';
import { AddUserDto } from './dto/add-user.dto';
import { PrismaClient, SuperRoleName } from '@prisma/client';
import * as generatePassword from 'generate-password';
import { ListUserDto } from './dto/list-user.dto';
import { EditUserStatus, ViewUserDto } from './dto/view-user.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { ForgotPasswordDto, LoginDto, UpdatePasswordDto, UpdatePasswordThroughProfileDto } from '../core/dto/user-login.dto';
import { comparePasswords, encodePassword } from '../auth/bcrypt';
import * as ejs from 'ejs';
import * as fs from 'fs/promises';
import { ADMIN_URL, API_URL, HOSPITAL_URL } from '../core/consts/env.consts';

@Injectable()
export class UsersService {
  constructor(private notificationService: NotificationsService) { }

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
        token: null
      }
    })

    const templateContent = await fs.readFile('apps/api/src/assets/templates/update-password-template.ejs', 'utf-8');
    const message = ejs.render(templateContent, {
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
    });

    const sentMail = await this.notificationService.sendEmail(updatedUser.email, "Update Password", message);

    if (!sentMail) throw new HttpException("there is some problem while sending mail", HttpStatus.INTERNAL_SERVER_ERROR);

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
    };

  }

  async editUserPassword(id: number, updatePassword: UpdatePasswordThroughProfileDto): Promise<UserDto> {


    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });


    if (!user) throw new HttpException("user not found", HttpStatus.NOT_FOUND);
    if (updatePassword.new_password == updatePassword.old_password) throw new HttpException("Old password and new password should not be same", HttpStatus.BAD_REQUEST);
    if (!await comparePasswords(updatePassword.old_password, user.password)) throw new HttpException("password not matched", HttpStatus.BAD_REQUEST);

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
        password: encodePassword(updatePassword.new_password)
      }
    })

    return updatedUser

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
        token: token
      }
    });

    const resetPasswordLink = `${HOSPITAL_URL}/update-password/email/${updateUserToken.email}/token/${updateUserToken.token}`;

    const templateContent = await fs.readFile('apps/api/src/assets/templates/forgot-password-template.ejs', 'utf-8');
    const message = ejs.render(templateContent, {
      firstName: updateUserToken.firstName,
      lastName: updateUserToken.lastName,
      resetPasswordLink: resetPasswordLink,
      loginLink: HOSPITAL_URL
    });

    const sentMail = await this.notificationService.sendEmail(forgotPasswordDto.email, "Forgot Password", message);

    if (!sentMail) throw new HttpException("there is some problem while sending mail", HttpStatus.INTERNAL_SERVER_ERROR);

    return;

  }





  async createAdminUser(
    createUserDto: AddUserDto
  ): Promise<UserDto> {
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
        where:{
          userId: user.id,
          superRoleId: 1
        }
      })

      if(is_user_super_relation){
        throw new HttpException("user already exist with the super role", HttpStatus.BAD_REQUEST);
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

      const templateContent = await fs.readFile('apps/api/src/assets/templates/existing-admin-user-template.ejs', 'utf-8');

      const message = ejs.render(templateContent, {
        firstName: user.firstName,
        lastName: user.lastName,
        adminLoginLink: ADMIN_URL,
      });

      const sentMail = await this.notificationService.sendEmail(user.email, "You have been added in POYV Team", message);

      if (!sentMail) throw new HttpException("there is some problem while sending mail", HttpStatus.INTERNAL_SERVER_ERROR);

      return {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        superRole: 'ADMIN',
      };
    }

    const { superRole, organizationRoles, hospitalRole, ...newData } = data;

    const newUser = await this.prisma.user.create({
      data: newData,
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

    const resetPasswordLink = `${ADMIN_URL}/update-password/email/${newUser.email}/token/${token}`

    const templateContent = await fs.readFile('apps/api/src/assets/templates/new-admin-user-template.ejs', 'utf-8');

    const message = ejs.render(templateContent, {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      resetPasswordLink: resetPasswordLink,
      loginLink: ADMIN_URL,
    });

    const sentMail = await this.notificationService.sendEmail(newUser.email, "You have been added in Fountlab", message);

    if (!sentMail) throw new HttpException("there is some problem while sending mail", HttpStatus.INTERNAL_SERVER_ERROR);

    return {
      id: newUser.id,
      email: newUser.email,
      phoneNumber: newUser.phoneNumber,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      superRole: superRole,
    };
  }

  async create(
    hospitalId: number,
    createUserDto: AddUserDto & {
      isPrimary: boolean;
    }
  ): Promise<
    UserDto & {
      isPrimary: boolean;
    }
  > {
    // TODO: add generated password functionlity with smtp configurations and email validation...

    const token = this.generateRandomHexToken(16);

    const data = { ...createUserDto, token };

    const hospital = await this.prisma.hospital.findFirst({
      where: {
        id: hospitalId,
      },
    });
    if (!hospital) {
      throw new HttpException(
        'hospital with id' + hospitalId + ' not exist',
        HttpStatus.BAD_REQUEST
      );
    }

    const user = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    // if (user) {
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.BAD_REQUEST,
    //       error: 'User already exists',
    //     },
    //     HttpStatus.BAD_REQUEST
    //   );
    // }

    if (!user) {
      const { superRole, organizationRoles, hospitalRole, isPrimary, ...newData } =
        data;

      const newUser = await this.prisma.user.create({
        data: newData,
      });

      if (!newUser) {
        throw new BadRequestException('Failed to create user.');
      }
      // add relation to the users_hospital_roles

      const user_hospital_relation = await this.prisma.userHospitalRole.create({
        data: {
          userId: newUser.id,
          hospitalId: hospitalId,
          hospitalRoleId: 1,
          isPrimary: isPrimary,
        },
      });

      if (!user_hospital_relation) {
        throw new HttpException(
          'some error while establishing relation between user and hospital',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      if (isPrimary) {
        // set others with same role in the same hospital as not primary
        await this.prisma.userHospitalRole.updateMany({
          where: {
            hospitalId: hospitalId,
            hospitalRoleId: 1,
            userId: { not: newUser.id },
          },
          data: { isPrimary: false },
        });
      }

      const resetPasswordLink = `${HOSPITAL_URL}/update-password/email/${newUser.email}/token/${token}`

      const templateContent = await fs.readFile('apps/api/src/assets/templates/new-manager-template.ejs', 'utf-8');
  
      const message = ejs.render(templateContent, {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        hospitalName: hospital.name,
        resetPasswordLink: resetPasswordLink,
        loginLink: HOSPITAL_URL,
      });

      const sentMail = await this.notificationService.sendEmail(newUser.email, "You have been added in " + hospital.name, message);

      if (!sentMail) throw new HttpException("there is some problem while sending mail", HttpStatus.INTERNAL_SERVER_ERROR);

      return {
        id: newUser.id,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        hospitalRole: hospitalRole,
        isPrimary: isPrimary,
      };

    } else {
      const { superRole, organizationRoles, hospitalRole, isPrimary, ...newData } = data;
      const user_hospital_relation = await this.prisma.userHospitalRole.findFirst({
        where: {
          userId: user.id,
          hospitalId: hospitalId
        }
      });

      if (user_hospital_relation) {
        throw new HttpException(
          'user already present as manager for hospital',
          HttpStatus.BAD_REQUEST
        );
      }

      const new_user_hospital_relation = await this.prisma.userHospitalRole.create({
        data: {
          userId: user.id,
          hospitalId: hospitalId,
          hospitalRoleId: 1,
          isPrimary: isPrimary,
        },
      });

      const templateContent = await fs.readFile('apps/api/src/assets/templates/existing-manager-template.ejs', 'utf-8');
  
      const message = ejs.render(templateContent, {
        firstName: user.firstName,
        lastName: user.lastName,
        hospitalName: hospital.name,
        loginLink: HOSPITAL_URL,
      });

      const sentMail = await this.notificationService.sendEmail(user.email, "You have been added in " + hospital.name, message);

      if (!sentMail) throw new HttpException("there is some problem while sending mail", HttpStatus.INTERNAL_SERVER_ERROR);

      if (isPrimary) {
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

      return {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        hospitalRole: hospitalRole,
        isPrimary: isPrimary,
      };

    }


  }

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
        name: SuperRoleName.ADMIN
      }
    })
    const whereArray = [];
    let whereQuery = {};
    whereArray.push({
      superRoles: {
        some: {
          superRoleId: hospitalAdminRoleId.id
        }
      }
    })

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
        organizationRoles: {
          select: {
            organization: { select: { name: true } },
            organizationRole: { select: { name: true } },
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
      },
      select: {
        id: true,
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
        organizationRoles: {
          select: {
            organization: { select: { name: true } },
            organizationRole: { select: { name: true } },
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
        organizationRoles: user.organizationRoles.map((role) => ({
          name: role.organization.name,
          organizationRole: role.organizationRole.name,
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
        organizationRoles: {
          select: {
            organization: { select: { id: true } },
            organizationRole: { select: { name: true } },
          },
        },
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
    console.log(user)
    if (!user) {
      throw new NotFoundException();
    }
    if (!user.isActive) throw new HttpException("user is inactive", HttpStatus.BAD_REQUEST);

    const viewUser = {
      id: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      organizationRoles: user.organizationRoles.map((role) => ({
        organizationId: role.organization.id,
        organizationRole: role.organizationRole.name,
      })),
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
        id: id
      }
    });
    if (!user) throw new HttpException("user not found", HttpStatus.NOT_FOUND);

    const editedUser = await this.prisma.user.update({
      where: {
        id: id
      },
      data: {
        isActive: editUserStatus.isActive
      }
    })


    const templateContent = await fs.readFile('apps/api/src/assets/templates/deactivate-admin-user.ejs', 'utf-8');
  
    const message = ejs.render(templateContent, {
      firstName: user.firstName,
      lastName: user.lastName,
    });

    const sentMail = await this.notificationService.sendEmail(user.email, "You have been removed from Fountlab", message);

    if (!sentMail) throw new HttpException("there is some problem while sending mail", HttpStatus.INTERNAL_SERVER_ERROR);

    return editUserStatus
  }

  async edit(
    userDto: AddUserDto & {
      isPrimary: boolean;
    },
    hospitalId: number,
    id: number
  ): Promise<
    UserDto & {
      isPrimary: boolean;
    }
  > {
    let transaction;
    try {
      transaction = await this.prisma.$transaction(async (prisma) => {
        const checkUser = await this.findById(id);
        if (!checkUser) {
          throw new NotFoundException();
        }

        //check hospital
        const hospital = await prisma.hospital.findFirst({
          where: {
            id: hospitalId,
          },
        });
        if (!hospital) {
          throw new HttpException('hospital not found ', HttpStatus.BAD_REQUEST);
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
        const {
          superRole,
          organizationRoles,
          hospitalRole,
          isPrimary,
          ...newData
        } = data;

        // if (
        //   !superRole &&
        //   (!organizationRoles || organizationRoles.length === 0)
        // ) {
        //   throw new BadRequestException();
        // }

        const updateuser = await prisma.user.update({
          where: { id: id },
          data: newData,
        });
        await this.prisma.userHospitalRole.updateMany({
          where: { userId: updateuser.id, hospitalId: hospitalId },
          data: { isPrimary: isPrimary },
        });
        if (isPrimary) {
          // set others with same role in the same hospital as not primary
          await this.prisma.userHospitalRole.updateMany({
            where: {
              hospitalId: hospitalId,
              hospitalRoleId: 1,
              userId: { not: updateuser.id },
            },
            data: { isPrimary: false },
          });
        }

        // const superRoleInDatabase = await prisma.userSuperRole.findFirst({
        //   where: { userId: id },
        // });
        // const organizationRolesinDatabase =
        //   await this.prisma.userOrganizationRole.findMany({
        //     where: { userId: user.id },
        //   });

        // if (superRoleInDatabase) {
        //   if (!superRole)
        //     await prisma.userSuperRole.delete({
        //       where: { id: superRoleInDatabase.id },
        //     });
        // }

        // if (superRole) {
        //   const fntrole = await prisma.superRole.findFirst({
        //     where: { name: superRole },
        //   });
        //   const role = await prisma.userSuperRole.findFirst({
        //     where: { userId: id, superRoleId: fntrole.id },
        //   });
        //   if (!role) {
        //     await prisma.userSuperRole.create({
        //       data: { userId: id, superRoleId: fntrole.id },
        //     });
        //   }
        // }

        // const rolesPresentInDb = [];

        // if (organizationRoles && organizationRoles.length > 0) {
        //   for (const org of organizationRoles) {
        //     const { organizationId, organizationRole } = org;

        //     if (!organizationId) {
        //       throw new BadRequestException();
        //     }

        //     const orgCheck = await prisma.organization.findFirst({
        //       where: { id: organizationId },
        //     });

        //     if (!orgCheck) {
        //       throw new BadRequestException();
        //     }
        //     if (!organizationRole) {
        //       throw new BadRequestException();
        //     }

        //     const orgrole = await prisma.organizationRole.findFirst({
        //       where: { name: { equals: organizationRole } },
        //     });

        //     const role = await prisma.userOrganizationRole.findFirst({
        //       where: {
        //         userId: id,
        //         organizationRoleId: orgrole.id,
        //         organizationId: organizationId,
        //       },
        //     });

        //     if (role) {
        //       rolesPresentInDb.push(role);
        //     }

        //     if (!role) {
        //       await prisma.userOrganizationRole.create({
        //         data: {
        //           userId: id,
        //           organizationRoleId: orgrole.id,
        //           organizationId: organizationId,
        //         },
        //       });
        //     }
        //   }
        // }

        // const rolesPrsentInList = [];
        // rolesPresentInDb.forEach((value) => rolesPrsentInList.push(value.id));
        // const rolesPrsentinDb = [];
        // organizationRolesinDatabase.forEach((value) =>
        //   rolesPrsentinDb.push(value.id)
        // );
        // // add here
        // const missing = rolesPrsentinDb.filter(
        //   (item) => rolesPrsentInList.indexOf(item) < 0
        // );

        // if (missing && missing.length > 0) {
        //   await prisma.userOrganizationRole.deleteMany({
        //     where: { id: { in: missing } },
        //   });
        // }
        const updatedUser: UserDto & {
          isPrimary: boolean;
        } = {
          id: updateuser.id,
          email: updateuser.email,
          phoneNumber: updateuser.phoneNumber,
          firstName: updateuser.firstName,
          lastName: updateuser.lastName,
          organizationRoles: organizationRoles,
          superRole: superRole,
          isPrimary,
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

    if(hospitalUserRelation)  await this.prisma.userHospitalRole.delete({ where: { id: hospitalUserRelation.id, },});

    const templateContent = await fs.readFile('apps/api/src/assets/templates/deactivate-manager.ejs', 'utf-8');
  
    const message = ejs.render(templateContent, {
      firstName: checkUser.firstName,
      lastName: checkUser.lastName,
    });

    
    const sentMail = await this.notificationService.sendEmail(checkUser.email, "You have been removed from hospital ", message);

    if (!sentMail) throw new HttpException("there is some problem while sending mail", HttpStatus.INTERNAL_SERVER_ERROR);
  
    console.log('removed user...')
    return;
    
  }



  async editAdmin(
    userDto: AddUserDto,
    id: number
  ): Promise<
    UserDto
  > {
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
        const {
          superRole,
          organizationRoles,
          hospitalRole,

          ...newData
        } = data;



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
          organizationRoles: organizationRoles,
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

  async getFilteredPosts(
    pageSize: number,
    pageOffset: number,
    name: string,
    email: string,
    sortBy: string,
    sortOrder: 'asc' | 'desc'
  ): Promise<ListUserPageDto> {
    const whereArray = [];
    let whereQuery = {};

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
        lastName: true,
        organizationRoles: {
          select: {
            organization: { select: { name: true } },
            organizationRole: { select: { name: true } },
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
  }

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
        organizationRoles: user.organizationRoles.map((role) => ({
          name: role.organization.name,
          organizationRole: role.organizationRole.name,
        })),
        superRole:
          user.superRoles.length > 0
            ? (user.superRoles[0].superRole.name as SuperRoleName)
            : undefined,
      }));
    }
  }

  private generateRandomPassword(length: number): string {
    const password = generatePassword.generate({
      length,
      numbers: true,
      symbols: true,
      uppercase: true,
      excludeSimilarCharacters: true,
    });
    return password;
  }
}

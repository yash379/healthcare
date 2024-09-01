import {
  Body,
  Controller,
  Post,
  Get,
  Request,
  Put,
  UseGuards,
  Param,
  Query,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AddManagerDto, AddUserDto } from './dto/add-user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { ListUserPageDto } from './dto/list-user-page.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminCountsDto, AssetCountDashboardDto, ManagerDto, UserDto } from './dto/user.dto';
import { EditUserStatus, ViewUserDto } from './dto/view-user.dto';
import { ForgotPasswordDto, LoginDto, UpdatePasswordDto, UpdatePasswordThroughProfileDto } from '../core/dto/user-login.dto';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { AddDoctorDto } from './dto/add-doctor.dto';
import { DoctorDto } from './dto/doctors.dto';
import { ListDoctorPageDto } from './dto/list-doctor-page.dto';
import { ViewDoctorDto } from './dto/view-doctor.dto';

@ApiTags("Users")
@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Post('/admins')
  @ApiOkResponse({ type: UserDto })
  @Roles(Role.POYV_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  createAdminUser(@Body() data: AddUserDto & {isPrimary: boolean}): Promise<UserDto> {
    return this.usersService.createAdminUser(data);
  }


  @UseGuards(AuthGuard, RolesGuard)
  @Get('/admins')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ListUserPageDto })
  @Roles(Role.POYV_ADMIN)
  listAdmins(
    @Query('pageSize') pageSize?: number,
    @Query('pageOffset') pageOffset?: number,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ) : Promise<ListUserPageDto> {
    return this.usersService.listAdmins(
      +pageSize,
      +pageOffset,
      name,
      email,
      sortBy,
      sortOrder
    );
  }

  
 

  @UseGuards(AuthGuard, RolesGuard)
  @Get('/asset-count')
  @ApiOperation({ summary: 'Get counts of total, active, and inactive admins' })
  @ApiOkResponse({ type: AdminCountsDto })
  @HttpCode(HttpStatus.OK)
  @Roles(Role.POYV_ADMIN)
  async getAdminCounts(): Promise<AdminCountsDto> {
    return await this.usersService.getAdminCounts();
  }


  @UseGuards(AuthGuard)
  @Put('/admins/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto })
  @Roles(Role.POYV_ADMIN)
  editAdmin(@Body() data: AddUserDto , @Param('id') id: number): Promise<UserDto> {
    return this.usersService.editAdmin(data,+id);
  }

  

  @Post('/hospitals/:hospitalId/manager')
  @ApiOkResponse({ type: UserDto })
  @Roles(Role.POYV_ADMIN,  Role.HOSPITAL_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  addManager(@Param('hospitalId') hospitalId: number,@Body() data: AddManagerDto & {isPrimary: boolean}): Promise<ManagerDto & {isPrimary: boolean} > {
    return this.usersService.addManager(+hospitalId,data);
  }

  
  @Put('update-password/email/:emailId/token/:token')
  @ApiOkResponse({ type: UserDto })
  @HttpCode(HttpStatus.CREATED)
  updatePassword(@Body() updatePasswordDto: UpdatePasswordDto): Promise<UserDto> {
    return this.usersService.updatePassword(updatePasswordDto);
  }


  @Post('forgot-password')
  @ApiOkResponse({ type: UserDto })
  @HttpCode(HttpStatus.ACCEPTED)
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto){
    return this.usersService.forgotPassword(forgotPasswordDto);
  }

  // @UseGuards(AuthGuard, RolesGuard)
  // @Get('/hospitals/:hospitalId/managers')
  // @HttpCode(HttpStatus.OK)
  // // @ApiOkResponse({ type: ViewUserDto })
  // @Roles(Role.POYV_ADMIN, Role.HOSPITAL_ADMIN)
  // listMangers(@Param('hospitalId') hospitalId: number) {
  //   return this.usersService.listMangers(+hospitalId);
  // }
  

  @UseGuards(AuthGuard, RolesGuard)
  @Get('users/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ViewUserDto })
  @Roles(Role.POYV_ADMIN, Role.HOSPITAL_ADMIN)
  findById(@Param('id') id: number): Promise<ViewUserDto> {
    return this.usersService.findById(id);
  }


  @UseGuards(AuthGuard, RolesGuard)
  @Put('users/change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ViewUserDto })
  @Roles(Role.POYV_ADMIN,Role.HOSPITAL_ADMIN,Role.ORGANIZATION_ADMIN)
  editUserPassword( @Body() editUserPassword: UpdatePasswordThroughProfileDto,@Request() req): Promise<UserDto> {
    const { user } = req;
    return this.usersService.editUserPassword(+user.id,editUserPassword);
  }


  @UseGuards(AuthGuard, RolesGuard)
  @Put('users/:id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ViewUserDto })
  @Roles(Role.POYV_ADMIN)
  editUserStatus(@Param('id') id: number,@Body() editUserStatus:EditUserStatus): Promise<EditUserStatus> {
    return this.usersService.editUserStatus(+id,editUserStatus);
  }

 

  // @UseGuards(AuthGuard)
  // @Delete('/hospitals/:hospitalId/managers/:id')
  // @Roles(Role.POYV_ADMIN, Role.HOSPITAL_ADMIN)
  // @HttpCode(HttpStatus.NO_CONTENT)
  // deleteUser(@Param('hospitalId') hospitalId: number,@Param('id') id: number): Promise<void> {
  //   return this.usersService.deleteUser(+hospitalId,+id);
  // }


  // @UseGuards(AuthGuard)
  // @Get('users')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: ListUserPageDto })
  // @Roles(Role.POYV_ADMIN)
  // async getFilteredPosts(
  //   @Query('pageSize') pageSize?: number,
  //   @Query('pageOffset') pageOffset?: number,
  //   @Query('name') name?: string,
  //   @Query('email') email?: string,
  //   @Query('sortBy') sortBy?: string,
  //   @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  // ): Promise<ListUserPageDto> {
  //   const listusers = await this.usersService.getFilteredPosts(
  //     +pageSize,
  //     +pageOffset,
  //     name,
  //     email,
  //     sortBy,
  //     sortOrder
  //   );
  //   return listusers;
  // }
}


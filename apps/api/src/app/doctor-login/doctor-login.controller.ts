import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
  HttpStatus,
  Param,
  HttpCode,
} from '@nestjs/common';
import { DoctorLocalAuthGuard } from '../doctor-auth/doctor-local-auth.guard';
import { LoginDto } from '../core/dto/user-login.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { DoctorAuthGuard } from '../doctor-auth/doctor-auth.guard';
import { UserDto } from '../users/dto/user.dto';
import { ViewUserDto } from '../users/dto/view-user.dto';
import { DoctorsService } from '../doctors/doctors.service';
import { DoctorDto } from '../doctors/dto/doctors.dto';

@Controller('')
export class DoctorLoginController {
  constructor(
    private doctorsService: DoctorsService
  ) {}
  @UseGuards(DoctorLocalAuthGuard)
  @Post('/doctor/login')
  login(@Body() loginDto: LoginDto, @Request() req) {
    console.log(req.user);
    console.log(req.doctor);
    return (
      this.doctorsService.findByIdForSwitch(req.user.id)
    );
  }

  @UseGuards(DoctorAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: DoctorDto })
  findByIdForSwitch(@Request() req): Promise<DoctorDto> {
    const UserId = req.user.id;
    return this.doctorsService.findByIdForSwitch(UserId);
  }

  @Post('/doctor/logout')
  @ApiOkResponse()
  logout(@Request() req): string {
    req.session.destroy();
    return 'You are logged out';
  }
}

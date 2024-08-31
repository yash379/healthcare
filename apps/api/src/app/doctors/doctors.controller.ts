import { Controller } from '@nestjs/common';
import {
    Body,
    Post,
    Get,
    Put,
    UseGuards,
    Param,
    Query,
    HttpStatus,
    HttpCode,
  } from '@nestjs/common';
  import { AuthGuard } from '../auth/auth.guard';
  import { RolesGuard } from '../auth/roles.guard';
  import { Roles } from '../auth/roles.decorator';
  import { Role } from '../auth/role.enum';
  import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
  import { UserDto } from './dto/user.dto';
  import { AddDoctorDto } from './dto/add-doctor.dto';
  import { DoctorDto } from './dto/doctors.dto';
  import { ListDoctorPageDto } from './dto/list-doctor-page.dto';
  import { ViewDoctorDto } from './dto/view-doctor.dto';
import { DoctorsService } from './doctors.service';
  
@ApiTags("Doctors")
@Controller()
export class DoctorsController {
    constructor(private doctorsService: DoctorsService) {}


    // @UseGuards(AuthGuard, RolesGuard)
  @Post('/hospitals/:hospitalId/doctor')
  @ApiOkResponse({ type: UserDto })
  @Roles(Role.POYV_ADMIN,  Role.HOSPITAL_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  create(@Param('hospitalId') hospitalId: number,@Body() data: AddDoctorDto ): Promise<DoctorDto > {
    return this.doctorsService.addDoctor(+hospitalId,data);
  }

  @UseGuards(AuthGuard)
  @Put('/hospitals/:hospitalId/doctor/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto })
  @Roles(Role.POYV_ADMIN, Role.HOSPITAL_ADMIN)
  edit(@Body() data: AddDoctorDto, @Param('hospitalId') hospitalId: number, @Param('id') id: number): Promise<DoctorDto> {
    return this.doctorsService.updateDoctor(data, +hospitalId,+id);
  }

  @UseGuards(AuthGuard, RolesGuard)
@Get('/hospitals/:hospitalId/doctors/:doctorId')
@HttpCode(HttpStatus.OK)
@ApiOkResponse({ type: ViewDoctorDto }) // Replace with the correct DTO type for doctor details
@Roles(Role.POYV_ADMIN)
getDoctorById(
  @Param('hospitalId') hospitalId: number,
  @Param('doctorId') doctorId: number
): Promise<ViewDoctorDto> { // Replace with the correct DTO type for doctor details
  return this.doctorsService.getDoctorById(+hospitalId, +doctorId);
}


  @UseGuards(AuthGuard, RolesGuard)
  @Get('/hospitals/:hospitalId/doctors')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ListDoctorPageDto })
  @Roles(Role.POYV_ADMIN)
  listDoctors(
    @Param('hospitalId') hospitalId: number,
    @Query('pageSize') pageSize?: number,
    @Query('pageOffset') pageOffset?: number,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ): Promise<ListDoctorPageDto> {
    return this.doctorsService.listDoctors(
      +hospitalId,
      +pageSize,
      +pageOffset,
      name,
      email,
      sortBy,
      sortOrder
    );
  }

}

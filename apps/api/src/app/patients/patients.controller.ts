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
//   import { UserDto } from './dto/user.dto';
import { AddPatientDto } from './dto/add-patient.dto';
import { PatientDto } from './dto/patient.dto';
import { ListPatientPageDto } from './dto/list-patient-page.dto';
import { ViewPatientDto } from './dto/view-patient.dto';
import { PatientsService } from './patients.service';

@ApiTags('Patients')
@Controller()
export class PatientsController {
  constructor(private patientsService: PatientsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Post('/hospitals/:hospitalId/doctors/:doctorId/patient')
  @ApiOkResponse({ type: PatientDto })
  @Roles(Role.POYV_ADMIN, Role.HOSPITAL_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('hospitalId') hospitalId: number,
    @Param('doctorId') doctorId: number,
    @Body() data: AddPatientDto
  ): Promise<PatientDto> {
    return this.patientsService.addPatient(+hospitalId, +doctorId, data);
  }

  @UseGuards(AuthGuard, RolesGuard)
@Get('/hospitals/:hospitalId/doctors/:doctorId/patients')
@ApiOkResponse({ type: ListPatientPageDto })
@Roles(Role.POYV_ADMIN)
@HttpCode(HttpStatus.OK)
listPatientsByDoctor(
  @Param('hospitalId') hospitalId: number,
  @Param('doctorId') doctorId: number,
  @Query('pageSize') pageSize?: number,
  @Query('pageOffset') pageOffset?: number,
  @Query('name') name?: string,
  @Query('email') email?: string,
  @Query('sortBy') sortBy?: string,
  @Query('sortOrder') sortOrder?: 'asc' | 'desc'
): Promise<ListPatientPageDto> {
  return this.patientsService.listPatients(
    +hospitalId,
    +doctorId,
    +pageSize,
    +pageOffset,
    name,
    email,
    sortBy,
    sortOrder
  );
}

}

import { Controller, Delete, HttpException } from '@nestjs/common';
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
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
//   import { UserDto } from './dto/user.dto';
import { AddPatientDto } from './dto/add-patient.dto';
import { PatientDto } from './dto/patient.dto';
import { ListPatientPageDto } from './dto/list-patient-page.dto';
import { ViewPatientDto } from './dto/view-patient.dto';
import { PatientsService } from './patients.service';
import { UpdatePatientDto } from './dto/update-patient.dto';

@ApiTags('Patients')
@Controller()
export class PatientsController {
  constructor(private patientsService: PatientsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Post('/hospitals/:hospitalId/doctors/:doctorId/patient')
  @ApiOkResponse({ type: PatientDto })
  @Roles(Role.POYV_ADMIN, Role.HOSPITAL_ADMIN, Role.HOSPITAL_DOCTOR, Role.HOSPITAL_PATIENT)
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
  @Roles(Role.POYV_ADMIN, Role.HOSPITAL_ADMIN, Role.HOSPITAL_DOCTOR, Role.HOSPITAL_PATIENT)
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

  @Get('/hospitals/:hospitalId/doctors/:doctorId/patient/:id')
  @ApiOkResponse({ type: ViewPatientDto })
  @Roles(Role.POYV_ADMIN, Role.HOSPITAL_ADMIN, Role.HOSPITAL_DOCTOR, Role.HOSPITAL_PATIENT)
  @ApiNotFoundResponse({ description: 'Patient not found' })
  async findById(
    @Param('hospitalId') hospitalId: number,
    @Param('doctorId') doctorId: number,
    @Param('id') patientId: number
  ): Promise<ViewPatientDto> {
    const patient = await this.patientsService.findPatientById(
      +hospitalId,
      +doctorId,
      +patientId
    );
    if (!patient) {
      throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
    }
    return patient;
  }

  @Get('/hospitals/:hospitalId/patients')
  @ApiOkResponse({ type: ViewPatientDto })
  @Roles(Role.POYV_ADMIN, Role.HOSPITAL_ADMIN, Role.HOSPITAL_DOCTOR, Role.HOSPITAL_PATIENT)
  @ApiNotFoundResponse({ description: 'Patient not found' })
  async findPatientByHospital(
    @Param('hospitalId') hospitalId: number
  ) {
    const patient = await this.patientsService.findPatientByHospital(
      +hospitalId
    );
    if (!patient) {
      throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
    }
    return patient;
  }
  

  @Put('/hospitals/:hospitalId/doctors/:doctorId/patient/:id')
  @HttpCode(HttpStatus.OK) // Optionally set the HTTP status code
  @Roles(Role.POYV_ADMIN, Role.HOSPITAL_ADMIN, Role.HOSPITAL_DOCTOR, Role.HOSPITAL_PATIENT)
  async updatePatientById(
    @Param('hospitalId') hospitalId: number,
    @Param('doctorId') doctorId: number,
    @Param('id') patientId: number,
    @Body() updatePatientDto: UpdatePatientDto
  ): Promise<ViewPatientDto> {
    return this.patientsService.updatePatientById(
      +hospitalId,
      +doctorId,
      +patientId,
      updatePatientDto
    );
  }

  @Delete('/hospitals/:hospitalId/doctors/:doctorId/patient/:id')
  @HttpCode(HttpStatus.NO_CONTENT) // Setting the HTTP status to 204 No Content
  @Roles(Role.POYV_ADMIN, Role.HOSPITAL_ADMIN, Role.HOSPITAL_DOCTOR, Role.HOSPITAL_PATIENT)
  async deletePatientById(
    @Param('hospitalId') hospitalId: number,
    @Param('doctorId') doctorId: number,
    @Param('id') patientId: number
  ): Promise<void> {
    await this.patientsService.deletePatientById(
      +hospitalId,
      +doctorId,
      +patientId
    );
  }


  // omkar workingg testing 

  @Get('/hospitals/:hospitalId/doctors/:doctorId/patient/:id/all')
  @ApiNotFoundResponse({ description: 'Patient not found' })
  async getpatientdetails(
    @Param('hospitalId') hospitalId: number,
    @Param('doctorId') doctorId: number,
    @Param('id') patientId: number
  ) {
    const patient = await this.patientsService.patientdetails(
      +hospitalId,
      +doctorId,
      +patientId
    );
    if (!patient) {
      throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
    }
    return patient;
  }
}

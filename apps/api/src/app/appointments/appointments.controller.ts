import { Controller, Delete, HttpException, HttpStatus, Post, Get, Put, Param, Body, Query, UseGuards, HttpCode } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { ApiTags, ApiOkResponse, ApiNotFoundResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { AddAppointmentDto } from './dto/add-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentDto, AppointmentStatusCountsDto } from './dto/appointment.dto';
import { ListAppointmentPageDto } from './dto/list-appointment-page.dto';
import { AppointmentStatus, GetAppointmentDto, ViewAppointmentDto } from './dto/view-appointment.dto';

@ApiTags('Appointments')
@Controller()
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Post('hospitals/:hospitalId/doctors/:doctorId/patients/:patientId/appointments')
  @ApiOkResponse({ type: AppointmentDto })
  @Roles(Role.POYV_ADMIN, Role.HOSPITAL_ADMIN, Role.HOSPITAL_DOCTOR, Role.HOSPITAL_PATIENT)
  @HttpCode(HttpStatus.CREATED)
  createAppointment(
    @Param('hospitalId') hospitalId: number,
    @Param('doctorId') doctorId: number,
    @Param('patientId') patientId: number,
    @Body() data: AddAppointmentDto
  ): Promise<ViewAppointmentDto> {
    return this.appointmentsService.createAppointment(+hospitalId, +doctorId, +patientId, data);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get('hospitals/:hospitalId/doctors/:doctorId/patients/:patientId/appointments')
  @ApiOkResponse({ type: ListAppointmentPageDto })
  @Roles(Role.POYV_ADMIN, Role.HOSPITAL_DOCTOR, Role.HOSPITAL_PATIENT)
  @HttpCode(HttpStatus.OK)
  listAppointments(
    @Param('hospitalId') hospitalId: number,
    @Param('doctorId') doctorId: number,
    @Param('patientId') patientId: number,
    @Query('pageSize') pageSize?: number,
    @Query('pageOffset') pageOffset?: number,
    @Query('appointmentDate') appointmentDate?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ): Promise<ListAppointmentPageDto> {
    return this.appointmentsService.listAppointments(
      +hospitalId,
      +doctorId,
      +patientId,
      +pageSize,
      +pageOffset,
      appointmentDate,
      sortBy,
      sortOrder
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get('hospitals/:hospitalId/doctors/:doctorId/appointments')
  @ApiOkResponse({ type: ListAppointmentPageDto })
  @Roles(Role.POYV_ADMIN, Role.HOSPITAL_DOCTOR, Role.HOSPITAL_PATIENT)
  @HttpCode(HttpStatus.OK)
  listDoctorAppointments(
    @Param('hospitalId') hospitalId: number,
    @Param('doctorId') doctorId: number,
    @Query('pageSize') pageSize?: number,
    @Query('pageOffset') pageOffset?: number,
    @Query('appointmentDate') appointmentDate?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ): Promise<ListAppointmentPageDto> {
    return this.appointmentsService.listDoctorAppointments(
      +hospitalId,
      +doctorId,
      +pageSize,
      +pageOffset,
      appointmentDate,
      sortBy,
      sortOrder
    );
  }


  @UseGuards(AuthGuard, RolesGuard)
  @Get('hospitals/:hospitalId/patients/:patientId/appointments')
  @ApiOkResponse({ type: ListAppointmentPageDto })
  @Roles(Role.POYV_ADMIN, Role.HOSPITAL_DOCTOR, Role.HOSPITAL_PATIENT)
  @HttpCode(HttpStatus.OK)
  listPatientAppointments(
    @Param('hospitalId') hospitalId: number,
    @Param('patientId') patientId: number,
    @Query('pageSize') pageSize?: number,
    @Query('pageOffset') pageOffset?: number,
    @Query('appointmentDate') appointmentDate?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ): Promise<ListAppointmentPageDto> {
    return this.appointmentsService.listPatientAppointments(
      +hospitalId,
      +patientId,
      +pageSize,
      +pageOffset,
      appointmentDate,
      sortBy,
      sortOrder
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get('hospitals/:hospitalId/appointments')
  @ApiOkResponse({ type: ListAppointmentPageDto })
  @Roles(Role.POYV_ADMIN, Role.HOSPITAL_DOCTOR, Role.HOSPITAL_PATIENT)
  @HttpCode(HttpStatus.OK)
  listHospitalAppointments(
    @Param('hospitalId') hospitalId: number,
    @Query('pageSize') pageSize?: number,
    @Query('pageOffset') pageOffset?: number,
    @Query('appointmentDate') appointmentDate?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ): Promise<ListAppointmentPageDto> {
    return this.appointmentsService.listHospitalAppointments(
      +hospitalId,
      +pageSize,
      +pageOffset,
      appointmentDate,
      sortBy,
      sortOrder
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get('hospitals/:hospitalId/doctors/:doctorId/patients/:patientId/appointments/:id')
  @ApiOkResponse({ type: AppointmentDto })
  @Roles(Role.POYV_ADMIN, Role.HOSPITAL_DOCTOR, Role.HOSPITAL_PATIENT)
  @ApiNotFoundResponse({ description: 'Appointment not found' })
  async findAppointmentById(
    @Param('hospitalId') hospitalId: number,
    @Param('doctorId') doctorId: number,
    @Param('patientId') patientId: number,
    @Param('id') appointmentId: number
  ): Promise<GetAppointmentDto> {
    const appointment = await this.appointmentsService.findAppointmentById(
      +hospitalId,
      +doctorId,
      +patientId,
      +appointmentId
    );
    if (!appointment) {
      throw new HttpException('Appointment not found', HttpStatus.NOT_FOUND);
    }
    return appointment;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Put('hospitals/:hospitalId/doctors/:doctorId/patients/:patientId/appointments/:id')
  @Roles(Role.POYV_ADMIN, Role.HOSPITAL_DOCTOR, Role.HOSPITAL_PATIENT)
  @HttpCode(HttpStatus.OK)
  async updateAppointment(
    @Param('hospitalId') hospitalId: number,
    @Param('doctorId') doctorId: number,
    @Param('patientId') patientId: number,
    @Param('id') appointmentId: number,
    @Body() updateAppointmentDto: UpdateAppointmentDto
  ): Promise<ViewAppointmentDto> {
    return this.appointmentsService.updateAppointment(
      +hospitalId,
      +doctorId,
      +patientId,
      +appointmentId,
      updateAppointmentDto
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Delete('hospitals/:hospitalId/doctors/:doctorId/patients/:patientId/appointments/:id')
  @Roles(Role.POYV_ADMIN, Role.HOSPITAL_DOCTOR, Role.HOSPITAL_PATIENT)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAppointment(
    @Param('hospitalId') hospitalId: number,
    @Param('doctorId') doctorId: number,
    @Param('patientId') patientId: number,
    @Param('id') appointmentId: number
  ): Promise<void> {
    await this.appointmentsService.deleteAppointment(
      +hospitalId,
      +doctorId,
      +patientId,
      +appointmentId
    );
  }

  @ApiOperation({ summary: 'Use this API to list appointment Status' })
  @UseGuards(AuthGuard)
  @ApiResponse({ status: HttpStatus.OK, type: [AppointmentStatus] })
  @Get('/appointmentStatuses')
  getProjectStatuses() {
    return this.appointmentsService.getAppointmentStatuses();
  }

  @UseGuards(AuthGuard, RolesGuard)
@Get('/hospitals/:hospitalId/appointment-count')
@ApiOperation({ summary: 'Get counts of appointments based on their status' })
@ApiOkResponse({ type: AppointmentStatusCountsDto })
@HttpCode(HttpStatus.OK)
@Roles(Role.POYV_ADMIN, Role.HOSPITAL_DOCTOR, Role.HOSPITAL_PATIENT)
async getAppointmentCounts(
  @Param('hospitalId') hospitalId: number
): Promise<AppointmentStatusCountsDto> {
  return await this.appointmentsService.getAppointmentCounts(+hospitalId);
}

}

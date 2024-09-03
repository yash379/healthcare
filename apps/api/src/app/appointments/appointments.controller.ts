import { Controller, Delete, HttpException, HttpStatus, Post, Get, Put, Param, Body, Query, UseGuards, HttpCode } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { ApiTags, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { AddAppointmentDto } from './dto/add-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentDto } from './dto/appointment.dto';
import { ListAppointmentPageDto } from './dto/list-appointment-page.dto';

@ApiTags('Appointments')
@Controller('hospitals/:hospitalId/doctors/:doctorId/patients/:patientId')
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Post('appointments')
  @ApiOkResponse({ type: AppointmentDto })
  @Roles(Role.POYV_ADMIN, Role.HOSPITAL_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  createAppointment(
    @Param('hospitalId') hospitalId: number,
    @Param('doctorId') doctorId: number,
    @Param('patientId') patientId: number,
    @Body() data: AddAppointmentDto
  ): Promise<AppointmentDto> {
    return this.appointmentsService.createAppointment(+hospitalId, +doctorId, +patientId, data);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get('appointments')
  @ApiOkResponse({ type: ListAppointmentPageDto })
  @Roles(Role.POYV_ADMIN)
  @HttpCode(HttpStatus.OK)
  listAppointments(
    @Param('hospitalId') hospitalId: number,
    @Param('doctorId') doctorId: number,
    @Param('patientId') patientId: number,
    @Query('pageSize') pageSize?: number,
    @Query('pageOffset') pageOffset?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ): Promise<ListAppointmentPageDto> {
    return this.appointmentsService.listAppointments(
      +hospitalId,
      +doctorId,
      +patientId,
      +pageSize,
      +pageOffset,
      sortBy,
      sortOrder
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get('appointments/:id')
  @ApiOkResponse({ type: AppointmentDto })
  @ApiNotFoundResponse({ description: 'Appointment not found' })
  async findAppointmentById(
    @Param('hospitalId') hospitalId: number,
    @Param('doctorId') doctorId: number,
    @Param('patientId') patientId: number,
    @Param('id') appointmentId: number
  ): Promise<AppointmentDto> {
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
  @Put('appointments/:id')
  @HttpCode(HttpStatus.OK)
  async updateAppointment(
    @Param('hospitalId') hospitalId: number,
    @Param('doctorId') doctorId: number,
    @Param('patientId') patientId: number,
    @Param('id') appointmentId: number,
    @Body() updateAppointmentDto: UpdateAppointmentDto
  ): Promise<AppointmentDto> {
    return this.appointmentsService.updateAppointment(
      +hospitalId,
      +doctorId,
      +patientId,
      +appointmentId,
      updateAppointmentDto
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Delete('appointments/:id')
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
}

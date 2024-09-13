import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { PrescriptionService } from './prescription.service';
import { CreatePrescriptionDto, CreatePrescriptionsWrapperDto } from './dto/create-prescription-dto';
import { UpdatePrescriptionDto } from './dto/update-prescription-dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListPrescriptionPageDto } from './dto/list-prescription-page.dto';
import { ViewPrescriptionDto } from './dto/view-prescription.dto';

@ApiTags("Prescriptions")
@Controller('prescriptions')
export class PrescriptionController {
  constructor(private readonly prescriptionService: PrescriptionService) {}


  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  @Roles(Role.POYV_ADMIN, Role.HOSPITAL_DOCTOR, Role.HOSPITAL_PATIENT)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPrescriptionsWrapperDto: CreatePrescriptionsWrapperDto) {
    return this.prescriptionService.create(createPrescriptionsWrapperDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePrescriptionDto: UpdatePrescriptionDto
  ) {
    return this.prescriptionService.update(+id, updatePrescriptionDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(Role.POYV_ADMIN, Role.HOSPITAL_DOCTOR, Role.HOSPITAL_PATIENT)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number) {
    return this.prescriptionService.delete(+id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get(':id')
  @ApiOkResponse({ type: ViewPrescriptionDto })
  @Roles(Role.POYV_ADMIN, Role.HOSPITAL_DOCTOR, Role.HOSPITAL_PATIENT)
  async getById(@Param('id') id: number): Promise<ViewPrescriptionDto>  {
    return this.prescriptionService.getById(+id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ListPrescriptionPageDto })
  @Roles(Role.POYV_ADMIN, Role.HOSPITAL_DOCTOR, Role.HOSPITAL_PATIENT)
  getAll(
    @Query('pageSize') pageSize?: number,
    @Query('pageOffset') pageOffset?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ) : Promise<ListPrescriptionPageDto> {
    return this.prescriptionService.getAll(
      +pageSize,
      +pageOffset,
      sortBy,
      sortOrder
    );
  }
}

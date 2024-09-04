import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Param,
  Body,
} from '@nestjs/common';
import { PrescriptionService } from './prescription.service';
import { CreatePrescriptionDto } from './dto/create-prescription-dto';
import { UpdatePrescriptionDto } from './dto/update-prescription-dto';

@Controller('prescriptions')
export class PrescriptionController {
  constructor(private readonly prescriptionService: PrescriptionService) {}

  @Post()
  async create(@Body() createPrescriptionDto: CreatePrescriptionDto) {
    return this.prescriptionService.create(createPrescriptionDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePrescriptionDto: UpdatePrescriptionDto
  ) {
    return this.prescriptionService.update(+id, updatePrescriptionDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.prescriptionService.delete(+id);
  }

  @Get(':id')
  async getById(@Param('id') id: number) {
    return this.prescriptionService.getById(+id);
  }

  @Get()
  async getAll() {
    return this.prescriptionService.getAll();
  }
}

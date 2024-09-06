import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Param,
  Body,
} from '@nestjs/common';
import { DiagnosisService } from './diagnosis.service';
import { CreateDiagnosisDto } from './dto/create-diagnosis-dto';
import { UpdateDiagnosisDto } from './dto/update-diagnosis-dto';

@Controller('diagnoses')
export class DiagnosisController {
  constructor(private readonly diagnosisService: DiagnosisService) {}

  @Post()
  async create(@Body() createDiagnosisDto: CreateDiagnosisDto) {
    return this.diagnosisService.create(createDiagnosisDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDiagnosisDto: UpdateDiagnosisDto
  ) {
    return this.diagnosisService.update(+id, updateDiagnosisDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.diagnosisService.delete(+id);
  }

  @Get(':id')
  async getById(@Param('id') id: number) {
    return this.diagnosisService.getById(+id);
  }

  @Get()
  async getAll() {
    return this.diagnosisService.getAll();
  }
}

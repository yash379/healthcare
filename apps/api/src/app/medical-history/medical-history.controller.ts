import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { MedicalHistoryService } from './medical-history.service';

@Controller('medical-history')
export class MedicalHistoryController {
  constructor(private readonly medicalHistoryService: MedicalHistoryService) {}

  @Get(':patientId')
  async getMedicalHistory(@Param('patientId') patientId: number) {
    return this.medicalHistoryService.getMedicalHistory(+patientId);
  }
}

import { ViewPrescription } from '@healthcare/data-transfer-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateMedicineDto } from './create-prescription-dto';

export class ViewPrescriptionDto implements ViewPrescription {
  @ApiProperty()
  id: number;

  @ApiProperty()
  doctorId: number;

  @ApiProperty()
  patientId: number;

  @ApiProperty()
  prescriptionDate: string; // Should be in ISO string format

  @ApiProperty({ type: [CreateMedicineDto] })
  medicines: CreateMedicineDto[]; // List of medicines associated with the prescription

  @ApiProperty({ required: false })
  medicalHistoryId?: number; // Optional field
}

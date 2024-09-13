import { ListPrescriptionPage } from '@healthcare/data-transfer-types';
import { ListPrescriptionDto } from './list-prescription.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PageBaseDto } from '../../core/dto/page-base.dto';

export class ListPrescriptionPageDto extends PageBaseDto implements ListPrescriptionPage {
  @ApiProperty({ type: [ListPrescriptionDto] }) content: ListPrescriptionDto[];
}


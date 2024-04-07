import { ListPatientPage } from '@healthcare/data-transfer-types';
import { ListPatientDto } from './list-patient.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PageBaseDto } from '../../core/dto/page-base.dto';

export class ListPatientPageDto extends PageBaseDto implements ListPatientPage {
  @ApiProperty({ type: [ListPatientDto] }) content: ListPatientDto[];
}

import { ListPatientPage } from '@healthcare/data-transfer-types';
import { ApiProperty } from '@nestjs/swagger';
import { PageBaseDto } from '../../core/dto/page-base.dto';
import { ListPatientAllDetailsDto, ListPatientDto } from './list-patient.dto';


export class ListPatientPageDto extends PageBaseDto implements ListPatientPage {
  @ApiProperty({ type: [ListPatientDto] }) content: ListPatientDto[];
}
export class ListPatientAllDetailsPageDto extends PageBaseDto implements ListPatientPage {
  @ApiProperty({ type: [ListPatientAllDetailsDto] }) content: ListPatientAllDetailsDto[];
}
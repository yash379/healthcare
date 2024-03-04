import { ListHospitalPage } from '@healthcare/data-transfer-types';
import { ListHospitalDto } from './list-hospital.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PageBaseDto } from '../../core/dto/page-base.dto';

export class ListHospitalPageDto
  extends PageBaseDto
  implements ListHospitalPage
{
  @ApiProperty({ type: [ListHospitalDto] }) content: ListHospitalDto[];
}

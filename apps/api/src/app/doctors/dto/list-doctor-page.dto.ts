import { ListDoctorPage } from '@healthcare/data-transfer-types';
import { ApiProperty } from '@nestjs/swagger';
import { PageBaseDto } from '../../core/dto/page-base.dto';
import { ListDoctorDto } from './list-doctor.dto';


export class ListDoctorPageDto extends PageBaseDto implements ListDoctorPage {
  @ApiProperty({ type: [ListDoctorDto] }) content: ListDoctorDto[];
}
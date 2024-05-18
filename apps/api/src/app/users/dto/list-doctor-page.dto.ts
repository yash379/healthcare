import { ListDoctorPage } from '@healthcare/data-transfer-types';
import { ListDoctorDto } from './list-doctor.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PageBaseDto } from '../../core/dto/page-base.dto';

export class ListDoctorPageDto extends PageBaseDto implements ListDoctorPage {
  @ApiProperty({ type: [ListDoctorDto] }) content: ListDoctorDto[];
}

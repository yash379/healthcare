import { SortByOrder, SortOrder } from '@healthcare/data-transfer-types';
import { ApiProperty } from '@nestjs/swagger';

export class SortByOrderDto implements SortByOrder {
  @ApiProperty() by: string;
  @ApiProperty({ enum: ['asc', 'desc'] }) order: SortOrder;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ChatRequestDto {
  @ApiProperty({
    description: 'Text to be sent to the chat API',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  text: string;
}

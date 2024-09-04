import { Controller, Post, Body } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ChatRequestDto } from './dto/chat-request.dto'; // Adjust the path if necessary
import { ChatRequestService } from './chat-request.service';

@ApiTags('chat')
@Controller('chat-request')  // Add the @Controller() decorator with a path
export class ChatRequestController {
  constructor(private readonly chatRequestService: ChatRequestService) {}

  @Post('chat')
  @ApiBody({
    description: 'Chat request payload',
    type: ChatRequestDto,
  })
  async chat(@Body() body: ChatRequestDto): Promise<any> {
    return this.chatRequestService.chat(body.text);
  }
}

import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ChatRequestService } from './chat-request.service';
import { Express } from 'express';
import { ChatRequestDto } from './dto/chat-request.dto';

@ApiTags('chat')
@Controller('chat-request')
export class ChatRequestController {
  constructor(private readonly chatRequestService: ChatRequestService) {}

  @Post('chat')
  async chat(@Body() body: ChatRequestDto): Promise<any> {
    return this.chatRequestService.chat(body.text);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<any> {
    return this.chatRequestService.uploadFile(file);
  }
}

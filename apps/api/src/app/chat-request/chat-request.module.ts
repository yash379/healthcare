import { Module } from '@nestjs/common';
import { ChatRequestController } from './chat-request.controller';
import { ChatRequestService } from './chat-request.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [ChatRequestController],
  providers: [ChatRequestService],
})
export class ChatRequestModule {}

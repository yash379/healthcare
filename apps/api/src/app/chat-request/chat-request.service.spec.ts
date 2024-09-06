import { Test, TestingModule } from '@nestjs/testing';
import { ChatRequestService } from './chat-request.service';

describe('ChatRequestService', () => {
  let service: ChatRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatRequestService],
    }).compile();

    service = module.get<ChatRequestService>(ChatRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

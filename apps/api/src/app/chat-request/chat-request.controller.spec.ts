import { Test, TestingModule } from '@nestjs/testing';
import { ChatRequestController } from './chat-request.controller';

describe('ChatRequestController', () => {
  let controller: ChatRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatRequestController],
    }).compile();

    controller = module.get<ChatRequestController>(ChatRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

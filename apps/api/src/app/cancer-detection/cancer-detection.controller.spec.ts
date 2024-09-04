import { Test, TestingModule } from '@nestjs/testing';
import { CancerDetectionController } from './cancer-detection.controller';

describe('CancerDetectionController', () => {
  let controller: CancerDetectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CancerDetectionController],
    }).compile();

    controller = module.get<CancerDetectionController>(
      CancerDetectionController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CancerDetectionService } from './cancer-detection.service';

describe('CancerDetectionService', () => {
  let service: CancerDetectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CancerDetectionService],
    }).compile();

    service = module.get<CancerDetectionService>(CancerDetectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

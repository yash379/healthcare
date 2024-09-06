import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CancerDetectionService } from './cancer-detection.service';
import { CancerDetectionController } from './cancer-detection.controller';

@Module({
  imports: [HttpModule], // Import the HttpModule here
  controllers: [CancerDetectionController],
  providers: [CancerDetectionService],
})
export class CancerDetectionModule {}

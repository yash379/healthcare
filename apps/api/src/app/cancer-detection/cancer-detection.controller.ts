import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CancerDetectionService } from './cancer-detection.service';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UploadFileDto } from './dto/add-dto';

@Controller('cancer-detection')
export class CancerDetectionController {
  constructor(private readonly cancerDetectionService: CancerDetectionService) {}

  @Post('predict')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File to be uploaded',
    type: UploadFileDto,
  })
  async predict(@UploadedFile() file: Express.Multer.File): Promise<string> {
    return this.cancerDetectionService.predict(file);
  }
}

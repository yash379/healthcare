import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import FormData from 'form-data';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CancerDetectionService {
  constructor(private readonly httpService: HttpService) {}

  async predict(image: Express.Multer.File): Promise<string> {
    const formData = new FormData();
    formData.append('file', image.buffer, image.originalname);

    try {
      const response = await lastValueFrom(
        this.httpService.post('http://127.0.0.1:8000/predict', formData, {
          headers: formData.getHeaders(),
        })
      );

      return response.data.prediction;
    } catch (error) {
      // If the error is related to the request, throw a BadRequestException
      if (error.response && error.response.status === HttpStatus.BAD_REQUEST) {
        throw new BadRequestException(
          'Invalid request to FastAPI. Please check the file and try again.'
        );
      }
      // Otherwise, handle it as an internal server error
      throw new HttpException(
        'Failed to get prediction from FastAPI',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

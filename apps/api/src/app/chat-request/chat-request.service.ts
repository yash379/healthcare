import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ChatRequestService {
  constructor(private readonly httpService: HttpService) {}

  async chat(text: string): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.httpService.post('http://127.0.0.1:8000/chat', { text })
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === HttpStatus.BAD_REQUEST) {
        throw new BadRequestException(
          'Invalid request to chat API. Please check the input and try again.'
        );
      }
      throw new HttpException(
        'Failed to get response from chat API',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<any> {
    try {
      // Prepare form data for file upload
      const formData = new FormData();
      formData.append('file', new Blob([file.buffer]), file.originalname);

      const response = await lastValueFrom(
        this.httpService.post('http://127.0.0.1:8000/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      );

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === HttpStatus.BAD_REQUEST) {
        throw new BadRequestException(
          'Invalid request to upload API. Please check the file and try again.'
        );
      }
      throw new HttpException(
        'Failed to upload file to the API',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

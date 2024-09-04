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
        // If the error is related to a bad request, throw BadRequestException
        throw new BadRequestException(
          'Invalid request to chat API. Please check the input and try again.'
        );
      }
      // For other types of errors, throw a generic internal server error
      throw new HttpException(
        'Failed to get response from chat API',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

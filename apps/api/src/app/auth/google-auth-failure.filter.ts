import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { GoogleSSOUnauthorizedException } from './google-sso-unauthorized';
import { AUTHORIZED_CALLBACK_URL } from '../environment';

@Catch(GoogleSSOUnauthorizedException)
export class GoogleAuthFailureFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const redirectUrl = `${AUTHORIZED_CALLBACK_URL}?status=${status}`;

    response.status(status).redirect(redirectUrl);
  }
}



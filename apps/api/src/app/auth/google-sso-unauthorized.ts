import { HttpException, HttpStatus } from '@nestjs/common';

export class GoogleSSOUnauthorizedException extends HttpException {
  constructor() {
    super('Google SSO Authentication Failed', HttpStatus.UNAUTHORIZED);
  }
}

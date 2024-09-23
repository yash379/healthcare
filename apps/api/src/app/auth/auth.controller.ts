import {
  Controller,
  Get,
  NotFoundException,
  Redirect,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AUTHORIZED_CALLBACK_URL } from '../environment';
import { AuthService } from './auth.service';
import { AuthGuard as A } from './auth.guard';
import { GoogleAuthGuard } from './google-auth.guard';
import { GoogleAuthFailureFilter } from './google-auth-failure.filter';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {
    //
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @UseFilters(GoogleAuthFailureFilter)
  @Redirect(AUTHORIZED_CALLBACK_URL)
  async googleAuthRedirect(@Req() req) {
    // Handle successful Google OAuth2 login
    return {
      message: 'User information from Google',
      user: req.user,
    };
  }

  @Get('current-user')
  @UseGuards(A)
  async getCurrentUser(@Req() req) {
    const user = req.user;
    console.log('current user', user);
    if (!user) {
      throw new NotFoundException('User not authenticated');
    }
    return this.authService.getUser(user.email);
  }
}

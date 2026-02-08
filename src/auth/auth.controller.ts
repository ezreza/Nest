import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, User } from '@/common/decorators';
import { LoginDto } from './dtos/auth-login.dto';
import { RegisterDto } from './dtos/auth-register.dto';
import type { SafeUser } from '@/common/interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Public()
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Get('me')
  me(@User() user: SafeUser) {
    return user;
  }
}

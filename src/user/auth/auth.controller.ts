import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';
import { Public } from './decorators/public.decorator';
import type { AuthenticatedRequest } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('test')
  test(@Request() req: AuthenticatedRequest) {
    const user = req.user;
    return user;
  }

  @Public()
  @Post('/register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Public()
  @Post('/login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }
}

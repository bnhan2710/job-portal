import { Controller, Request, Post, UseGuards, Get, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public, ResponseMessage } from '../decorator/customize';
import { RegisterDto } from '../users/dto/create-user.dto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('register')
  @ResponseMessage("Register succesfully")
  register(@Body() registerDto: RegisterDto){
    return this.authService.register(registerDto)
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

}
import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RequestWithUser } from './request-with-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() signUpData: CreateUserDto) {
    return this.authService.signUp(signUpData);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  signIn(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user } = req;
    const cookie = this.authService.getCookie(user);
    res.setHeader('Set-Cookie', cookie);
    return user;
  }

  @Post('/logout')
  logoOut(@Res({ passthrough: true }) res: Response) {
    const logOutCookie = this.authService.getLogoutCookie();
    res.setHeader('Set-Cookie', logOutCookie);
  }
}

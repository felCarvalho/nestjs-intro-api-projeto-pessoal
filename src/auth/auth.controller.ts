import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';
import { User } from '../@custom-decorators/user-request/user.request';
import { JwtAuthGuard } from './auth-guards/auth.jwt.guard';
import { localAuthGuard } from './auth-guards/auth.local.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Cookies } from 'src/@custom-decorators/http-cookies/cookies';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @UseGuards(localAuthGuard)
  @Post('login')
  async loginLocal(
    @Res({ passthrough: true }) response: express.Response,
    @User() user: { id: string; email: string },
    @Body() body: LoginDto,
  ) {
    response.cookie('jwt', await this.authService.login(user), {
      httpOnly: true,
      secure: this.configService.get('AMBIENTE') === 'PRODUCTION',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24,
      path: '/refresh/tokens',
    });

    return {
      user,
      token: await this.authService.login(user),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(
    @Cookies('jwt') cookie: string,
    @User() user: { id: string },
    @Body() body: { email: string; password: string },
  ) {
    return cookie;
  }
}

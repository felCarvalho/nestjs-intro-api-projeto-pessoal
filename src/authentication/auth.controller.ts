import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { localAuthGuard } from './auth-guards/auth.local.guard';
import { jwtRefreshTokenGuard } from './auth-guards/auth.jwtRefreshToken.guard';
import { AuthService } from './service/auth.service';
import type { payload } from '../shared/core/contracts/contracts.auth';
import { User } from '../shared/core/@custom-decorators/user-request/user.request';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(localAuthGuard)
  @Post('login')
  async login(@User() payload: payload) {
    const token = await this.authService.createToken(payload);
    const refreshToken = await this.authService.createRefreshToken(
      payload,
      payload.sub,
    );

    const data = {
      accessToken: token.token,
      refreshToken: refreshToken,
      expAccessToken: token.payload?.exp,
    };

    return data;
  }

  @UseGuards(jwtRefreshTokenGuard)
  @Post('refresh-token')
  async refresh(@User() payload: payload) {
    const token = await this.authService.createToken(payload);
    const refreshToken = await this.authService.createRefreshToken(
      payload,
      payload.sub,
    );

    const data = {
      accessToken: token.token,
      refreshToken: refreshToken,
      expAccessToken: token.payload?.exp,
    };

    return data;
  }
}

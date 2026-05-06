import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { extractRefreshTokenFromRequest } from '../../shared/http-cookies/cookies';
import { AuthService } from '../service/auth.service';

@Injectable()
export class jwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: extractRefreshTokenFromRequest,
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: {
      sub: string;
      identifier: string;
      role: string;
      username: string;
      idToken: string;
      exp: number;
    },
  ) {
    const refreshToken = extractRefreshTokenFromRequest(req);

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh-token inválido');
    }

    await this.authService.validateRefreshToken(
      refreshToken,
      payload.sub,
      payload.identifier,
      payload.role,
      payload.idToken,
    );

    return payload;
  }
}

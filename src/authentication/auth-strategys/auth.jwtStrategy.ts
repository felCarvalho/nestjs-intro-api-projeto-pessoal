import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { extractJwtFromRequest } from '../../shared/http-cookies/cookies';
import { AuthService } from '../service/auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: extractJwtFromRequest,
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  validate(payload: {
    sub: string;
    identifier: string;
    role: string;
    username: string;
    exp: number;
  }) {
    return payload;
  }
}

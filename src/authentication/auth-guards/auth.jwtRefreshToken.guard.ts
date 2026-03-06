import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class jwtRefreshTokenGuard extends AuthGuard('jwt-refresh-token') {}

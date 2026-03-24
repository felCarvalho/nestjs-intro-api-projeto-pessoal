import { JwtService } from '@nestjs/jwt';
import { BaseAuthContract } from '../contracts/contracts.auth';
import { payload } from '../contracts/contracts.auth';
import { ConfigService } from '@nestjs/config';

export class BaseAuth implements BaseAuthContract {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  //gerar um token jwt
  async generateToken(payload: payload) {
    delete (payload as any).exp;
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '15m',
    });
  }

  async generateRefreshToken(payload: payload) {
    delete (payload as any).exp;

    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '1d',
    });
  }

  //este garoto apenas retorna o payload, mas nao verifica a assinatura do token
  async verifyToken(token: string) {
    try {
      const verifyToken: payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      return {
        sub: verifyToken.sub,
        role: verifyToken.role,
        identifier: verifyToken.identifier,
        username: verifyToken.username,
      } as payload;
    } catch (e) {
      console.error('Error verifying token:', e);
      return null;
    }
  }

  //este garoto apenas retorna o payload, mas nao verifica a assinatura do token
  async decodeToken(token: string) {
    try {
      const decodeToken: payload = await this.jwtService.decode(token);
      return decodeToken ? decodeToken : null;
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  }
}

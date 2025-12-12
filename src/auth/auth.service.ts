import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUsers(email: string, pass: string) {
    if (!pass || !email) {
      throw new UnauthorizedException('Usuário ou email inválida');
    }

    const findUser = await this.usersService.findUsers(email);

    if (!findUser) {
      throw new UnauthorizedException('Usuário ou email inválida');
    }

    const isPasswordValid = await bcrypt.compare(pass, findUser.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Usuário ou emailinválida');
    }

    const { password, ...user } = findUser;

    return user;
  }

  async login(user: { id: string; email: string }) {
    const acessToken = { sub: user.id, email: user.email };
    const refreshToken = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(acessToken, {
        expiresIn: '15m',
      }),
      refresh_token: await this.jwtService.signAsync(refreshToken, {
        expiresIn: '7d',
      }),
    };
  }
}

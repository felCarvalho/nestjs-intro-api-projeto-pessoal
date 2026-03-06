import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../service/auth.service';
import { Injectable } from '@nestjs/common';
import { ResultBuilderContract } from '../../shared/core/contracts/contracts.result';
import { NotificationBuilderContract } from '../../shared/core/contracts/contracts.notification';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    private readonly authService: AuthService,
    protected readonly result: ResultBuilderContract<any>,
    protected readonly notification: NotificationBuilderContract,
  ) {
    super({
      usernameField: 'identifier',
      passwordField: 'password',
    });
  }

  async validate(identifier: string, password: string) {
    const user = await this.authService.authValidate({ identifier, password });

    return user;
  }
}

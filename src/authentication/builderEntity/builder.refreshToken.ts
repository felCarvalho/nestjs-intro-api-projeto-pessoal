import { RefreshToken } from '../entities/refreshToken.entity';
import { RefreshTokenBuilderContracts } from '../contracts/refreshToken.contracts';
import { NotificationBuilderContract } from '../../shared/core/contracts/contracts.notification';
import { ResultBuilderContract } from '../../shared/core/contracts/contracts.result';
import { BaseHash } from '../../shared/core/baseHash/baseHash';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

export class RefreshTokenBuilder
  extends BaseHash
  implements RefreshTokenBuilderContracts<RefreshToken>
{
  protected refresh: RefreshToken;
  protected notification: NotificationBuilderContract;
  protected result: ResultBuilderContract<RefreshToken>;

  constructor(
    notification: NotificationBuilderContract,
    result: ResultBuilderContract<RefreshToken>,
    encrypt: typeof bcrypt,
    configService: ConfigService,
    entity: RefreshToken = new RefreshToken(),
  ) {
    super(encrypt, configService, notification, entity);
    this.refresh = entity;
    this.notification = notification;
    this.result = result;
  }

  setUser(user: string) {
    if (!user) {
      this.notification.setType('ERROR').setMessage('Ops, user inválido').add();
    }
    this.refresh.user = user;
    return this;
  }

  generateId() {
    const uuid = uuidv4();
    if (!uuid) {
      this.notification
        .setType('ERROR')
        .setMessage('Ops, não foi possível gerar um uuid válido')
        .add();
    }

    this.refresh.id = uuid;
    return this;
  }

  setStatus(status: 'ATIVO' | 'INATIVO') {
    if (!status) {
      this.notification
        .setType('ERROR')
        .setMessage('Ops! Status inválido')
        .add();
    }
    this.refresh.status = status;
    return this;
  }

  setCreateDate(date: Date) {
    this.refresh.createAt = date;
    return this;
  }

  setUpdateDate(date: Date) {
    this.refresh.updateAt = date;
    return this;
  }

  build() {
    const notification = this.notification;
    const result = this.result;

    if (notification.verifyErrors()) {
      result.setNotification(notification.build());
      result.setSuccess(false);
      return result.build();
    }

    const { data, refresh } = this;

    result.setData({ ...data, ...refresh });
    result.setNotification(notification.build());
    result.setSuccess(true);
    return result.build();
  }
}

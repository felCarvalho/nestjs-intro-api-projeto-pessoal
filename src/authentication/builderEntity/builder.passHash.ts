import { PassHash } from '../entities/passHash.entity';
import { PassHashBuilderContracts } from '../contracts/passHash.contract';
import { NotificationBuilderContract } from 'src/shared/core/contracts/contracts.notification';
import { ResultBuilderContract } from 'src/shared/core/contracts/contracts.result';
import { IUser } from '../../shared/core/types/types';
import * as bcrypt from 'bcrypt';
import { BaseHash } from '../../shared/core/baseHash/baseHash';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

export class PassHashBuilder
  extends BaseHash
  implements PassHashBuilderContracts<PassHash>
{
  private passHash: PassHash;
  protected notification: NotificationBuilderContract;
  protected result: ResultBuilderContract<PassHash>;

  constructor(
    notification: NotificationBuilderContract,
    result: ResultBuilderContract<PassHash>,
    encrypt: typeof bcrypt,
    configService: ConfigService,
    entity: PassHash = new PassHash(),
  ) {
    super(encrypt, configService, notification, entity);
    this.passHash = entity;
    this.notification = notification;
    this.result = result;
  }

  setUser(user: IUser) {
    if (!user) {
      this.notification.setType('ERROR').setMessage('Ops, user inválido').add();
    }
    this.passHash.user = user;
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

    this.passHash.id = uuid;
    return this;
  }

  setDeleteDate(date: string) {
    this.passHash.deleteAt = date;
    return this;
  }

  setCreateDate(date: string) {
    this.passHash.createAt = date;
    return this;
  }

  setUpdateDate(date: string) {
    this.passHash.updateAt = date;
    return this;
  }

  build() {
    const notification = this.notification;
    const result = this.result;

    if (notification.verifyErrors()) {
      result.setNotification(notification.build());
      result.setSuccess(true);
      return result.build();
    }

    const { data, passHash } = this;

    result.setData({ ...data, ...passHash });
    result.setNotification(notification.build());
    result.setSuccess(true);

    return result.build();
  }
}

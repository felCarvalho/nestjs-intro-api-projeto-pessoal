import { Credentials } from '../entities/credentials.entity';
import { CredentialsBuilderContracts } from '../contracts/credentials.contracts';
import { NotificationBuilderContract } from 'src/shared/core/contracts/contracts.notification';
import { ResultBuilderContract } from 'src/shared/core/contracts/contracts.result';
import { v4 as uuidv4 } from 'uuid';
import { IUser } from '../../shared/core/types/types';

const emailRegex =
  /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_'+\-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i;

export class CredentialsBuilder implements CredentialsBuilderContracts<Credentials> {
  private credentials: Credentials;
  protected notification: NotificationBuilderContract;
  protected result: ResultBuilderContract<Credentials>;

  constructor(
    result: ResultBuilderContract<Credentials>,
    notification: NotificationBuilderContract,
  ) {
    this.credentials = new Credentials();
    this.result = result;
    this.notification = notification;
  }

  setIdentifier(identifier: string) {
    if (!emailRegex.test(identifier)) {
      this.notification
        .setType('ERROR')
        .setMessage('Ops, identifier inválido')
        .add();
    }
    this.credentials.identifier = identifier;
    return this;
  }

  setProvider(provider: 'local') {
    if (provider !== 'local') {
      this.notification
        .setType('ERROR')
        .setMessage('Ops, provider inválido')
        .add();
    }
    this.credentials.provider = provider;
    return this;
  }

  setUser(user: IUser) {
    if (!user) {
      this.notification.setType('ERROR').setMessage('Ops, user inválido').add();
    }
    this.credentials.user = user;
    return this;
  }

  generateId() {
    const id = uuidv4();

    if (!id) {
      this.notification
        .setType('ERROR')
        .setMessage('Ops! não foi possivel gerar o seu id')
        .add();
    }

    this.credentials.id = id;
    return this;
  }

  setCreateDate(date: string) {
    this.credentials.createAt = date;
    return this;
  }

  setUpdateDate(date: string) {
    this.credentials.updateAt = date;
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

    result.setData(this.credentials);
    result.setNotification(notification.build());
    result.setSuccess(true);

    return result.build();
  }
}

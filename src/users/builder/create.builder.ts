import { UserCreateBuilderContract } from '../contracts/index.contract';
import { User } from '../entity/user.entity';
import { ResultBuilderContract } from '../../shared/core/contracts/contracts.result';
import { NotificationBuilderContract } from '../../shared/core/contracts/contracts.notification';
import { v4 as uuidv4 } from 'uuid';
import { BuilderCore } from '../../shared/core/builderCore/builder.core';

export class UserCreateBuilder
  extends BuilderCore
  implements UserCreateBuilderContract<User>
{
  protected user: User;
  protected result: ResultBuilderContract<User>;
  protected notification: NotificationBuilderContract;

  constructor(
    result: ResultBuilderContract<User>,
    notification: NotificationBuilderContract,
    user: User = new User(),
  ) {
    super(notification, user);
    this.user = user;
    this.result = result;
    this.notification = notification;
  }

  setName(name: string) {
    if (!name) {
      this.notification
        .setType('ERROR')
        .setMessage('Ops! nome de usuario não pode ser vazio')
        .add();
    }
    this.user.name = name;
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

    this.user.id = id;
    return this;
  }

  build() {
    const result = this.result;
    const notification = this.notification;

    if (notification.verifyErrors()) {
      result.setData(this.user);
      result.setNotification(notification.build());
      result.setSuccess(false);
      return result.build();
    }

    const { user, data } = this;

    result.setData({ ...user, ...data });
    result.setNotification(notification.build());
    result.setSuccess(true);
    return result.build();
  }
}

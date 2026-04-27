import { UserRoles } from '../entities/userRoles.entity';
import { UserRolesBuilderContract } from '../contracts/userRoules.contracts';
import { ResultBuilderContract } from 'src/shared/core/contracts/contracts.result';
import { NotificationBuilderContract } from 'src/shared/core/contracts/contracts.notification';
import { User } from '../../users/entity/user.entity';
import { Roles } from '../entities/roles.entity';

export class UserRolesBuilder implements UserRolesBuilderContract<UserRoles> {
  userRoles: UserRoles;
  notification: NotificationBuilderContract;
  result: ResultBuilderContract<UserRoles>;

  constructor(
    notification: NotificationBuilderContract,
    result: ResultBuilderContract<UserRoles>,
  ) {
    this.userRoles = new UserRoles();
    this.notification = notification;
    this.result = result;
  }

  setUser(user: User) {
    if (!user) {
      this.notification
        .setType('ERROR')
        .setMessage('Ops! id do usuario inválido')
        .add();
    }
    this.userRoles.user = user;
    return this;
  }

  setRoleId(role: Roles) {
    if (!role) {
      this.notification.setType('ERROR').setMessage('Ops! role inválida').add();
    }

    this.userRoles.role = role;
    return this;
  }

  setCreateDate(date: Date) {
    this.userRoles.createAt = date;
    return this;
  }

  setUpdateDate(date: Date) {
    this.userRoles.updateAt = date;
    return this;
  }

  setDeleteDate(date: Date | null) {
    this.userRoles.deleteAt = date;
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

    result.setData(this.userRoles);
    result.setNotification(notification.build());
    result.setSuccess(true);
    return result.build();
  }
}

import { NotificationException } from '../../shared/core/@custom-decorators/exception-custom/exception';
import { NotificationBuilderContract } from '../../shared/core/contracts/contracts.notification';
import { ResultBuilderContract } from '../../shared/core/contracts/contracts.result';
import {
  UserCreateBuilderContract,
  UserRepositoryContract,
} from '../contracts/index.contract';
import { User } from '../entity/user.entity';

export class UsersService {
  constructor(
    private readonly userRepo: UserRepositoryContract<User>,
    private readonly userBuilder: () => UserCreateBuilderContract<User>,
    private readonly notification: () => NotificationBuilderContract,
    private readonly result: () => ResultBuilderContract<User>,
  ) {}

  private verifyMinLength(data: string) {
    const min = 8;

    if (data.length < min) {
      return true;
    }

    return false;
  }

  private verifyMaxLength(data: string) {
    const max = 150;

    if (data.length > max) {
      return true;
    }

    return false;
  }

  async createUser(name: string) {
    const notification = this.notification();
    const result = this.result();

    if (!name) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Seu nome de usuário é inválido')
        .add();
    }

    const findUser = await this.userRepo.findName(name);

    if (findUser) {
      notification
        .setType('ERROR')
        .setMessage('Ops! já existe um usuário com esse nome')
        .add();
    }

    if (notification.verifyErrors() || notification.verifyWarnings()) {
      result
        .setCode(404)
        .setNotification(notification.build())
        .setSuccess(false);
      const resultException = result.build();

      throw new NotificationException(resultException);
    }

    const date = new Date();

    const user = this.userBuilder();
    user.setName(name);
    user.generateId();
    user.setCreateDate(date);
    user.setUpdateDate(date);
    const userBuild = user.build();

    if (!userBuild.success) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Erro ao criar nome de usuário')
        .add();
    }

    if (this.verifyMinLength(userBuild.data.name)) {
      notification
        .setType('WARNING')
        .setMessage('Ops! Nome de usuário muito curto')
        .add();
    }

    if (this.verifyMaxLength(userBuild.data.name)) {
      notification
        .setType('WARNING')
        .setMessage('Ops! Nome de usuário muito grande')
        .add();
    }

    if (notification.verifyErrors() || notification.verifyWarnings()) {
      result
        .setCode(404)
        .setNotification(notification.build())
        .setSuccess(false);
      const resultException = result.build();

      throw new NotificationException(resultException);
    }

    notification
      .setType('INFO')
      .setMessage('Opa! Seu usuário foi criado')
      .add();

    const data = result
      .setCode(200)
      .setData(userBuild.data)
      .setNotification(notification.build())
      .setSuccess(true)
      .build();

    this.userRepo.createUser(data.data);
    console.log('use rodou');
    return data;
  }

  async findUserById(id: string) {
    const notification = this.notification();
    const result = this.result();

    if (!id) {
      notification.setType('ERROR').setMessage('Ops! ID inválido').add();
      result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false);
      const resultException = result.build();

      throw new NotificationException(resultException);
    }

    const user = await this.userRepo.findById(id);

    if (!user) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Usuário não encontrado')
        .add();

      result
        .setCode(404)
        .setNotification(notification.build())
        .setSuccess(false);
      const resultException = result.build();

      throw new NotificationException(resultException);
    }

    return result
      .setCode(200)
      .setData(user)
      .setNotification(notification.build())
      .setSuccess(true)
      .build();
  }
}

import { NotificationException } from '../../shared/core/@custom-decorators/exception-custom/exception';
import { NotificationBuilderContract } from '../../shared/core/contracts/contracts.notification';
import { ResultBuilderContract } from '../../shared/core/contracts/contracts.result';
import {
  UserCreateBuilderContract,
  UserRepositoryContract,
} from '../contracts/index.contract';
import { User } from '../entity/user.entity';
import {
  userNameSchemaValidator,
  UserNameProps,
} from '../../shared/core/strategy';

export class UsersService {
  constructor(
    private readonly userRepo: UserRepositoryContract<User>,
    private readonly userBuilder: () => UserCreateBuilderContract<User>,
    private readonly notification: () => NotificationBuilderContract,
    private readonly result: () => ResultBuilderContract<User>,
  ) {}

  async createUser(name: string) {
    const notification = this.notification();
    const result = this.result();

    const findUser = await this.userRepo.findName(name);

    const userProps: UserNameProps = {
      name,
      nameAlreadyExists: !!findUser,
    };

    const validationResult = await userNameSchemaValidator.execute(userProps);

    if (!validationResult.success) {
      return result
        .setCode(400)
        .setNotification(validationResult.notifications)
        .setSuccess(false)
        .build();
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
        .setKey('name')
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
      .setKey('name')
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
      notification.setType('ERROR').setMessage('Ops! ID inválido').setKey('id').add();
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
        .setKey('id')
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

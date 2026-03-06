import { NotificationException } from '../../shared/core/@custom-decorators/exception-custom/exception';
import {
  CredentialsBuilderContracts,
  CredentialsRepositoryContract,
} from '../../authentication/contracts/credentials.contracts';
import {
  PassHashBuilderContracts,
  PassHashRepositoryContract,
} from '../../authentication/contracts/passHash.contract';
import { RolesRepositoryContract } from '../../authentication/contracts/roles.contracts';
import {
  UserRolesBuilderContract,
  UserRolesRepositoryContract,
} from '../../authentication/contracts/userRoules.contracts';
import { NotificationBuilderContract } from '../../shared/core/contracts/contracts.notification';
import { PersistContract } from '../../shared/core/contracts/contracts.persistence';
import { ResultBuilderContract } from '../../shared/core/contracts/contracts.result';
import { TransactionContract } from '../../shared/core/contracts/contracts.transaction';
import {
  ICredentials,
  IPassHash,
  IRoles,
  IUserRoles,
} from '../../shared/core/types/types';
import {
  UserCreateBuilderContract,
  UserRepositoryContract,
} from '../contracts/index.contract';
//import { CreateUserDto } from '../dto/create-user.dto';
//import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entity/user.entity';

export class UsersService {
  constructor(
    private readonly persister: PersistContract<any>,
    private readonly userRepo: UserRepositoryContract<User>,
    private readonly transaction: TransactionContract,
    private readonly credentialsRepo: CredentialsRepositoryContract<ICredentials>,
    private readonly passHashRepo: PassHashRepositoryContract<IPassHash>,
    private readonly userRolesRepo: UserRolesRepositoryContract<IUserRoles>,
    private readonly passHashBuilder: () => PassHashBuilderContracts<IPassHash>,
    private readonly credentialsBuilder: () => CredentialsBuilderContracts<ICredentials>,
    private readonly userBuilder: () => UserCreateBuilderContract<User>,
    private readonly userRolesBuilder: () => UserRolesBuilderContract<IUserRoles>,
    private readonly roleRepo: RolesRepositoryContract<IRoles>,
    private readonly notification: () => NotificationBuilderContract,
    private readonly result: () => ResultBuilderContract<User>,
  ) {}

  verifyMinLength(data: string) {
    const min = 8;

    if (data.length < min) {
      return true;
    }

    return false;
  }

  verifyMaxLength(data: string) {
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

    const date = new Date().toISOString();

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
}

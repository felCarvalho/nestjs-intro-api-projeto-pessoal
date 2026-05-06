import { NotificationBuilderContract } from '../../core/contracts/contracts.notification';
import { ResultBuilderContract } from '../../core/contracts/contracts.result';
import { TransactionContract } from '../../../shared/core/contracts/contracts.transaction';
import { UsersService } from '../../../users/service/users.service';
import { AuthService } from '../../../authentication/service/auth.service';
import { User } from '../../../users/entity/user.entity';
import { NotificationException } from '../../core/@custom-decorators/exception-custom/exception';
import { CreateUserDto } from './create-user.dto';
import { PersistContract } from '../../../shared/core/contracts/contracts.persistence';
import { userSchemaValidator, CreateUserProps } from '../../core/strategy';

export class CreateUserOrquestrador {
  constructor(
    private readonly persist: PersistContract<any>,
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly transaction: TransactionContract,
    private readonly notification: () => NotificationBuilderContract,
    private readonly result: () => ResultBuilderContract<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const notification = this.notification();
    const result = this.result();

    const userProps: CreateUserProps = {
      name: createUserDto.name,
      identifier: createUserDto.identifier,
      password: createUserDto.password,
      passwordConfirm: createUserDto.passwordConfirm,
    };

    const validationResult = await userSchemaValidator.execute(userProps);

    if (!validationResult.success) {
      for (const notif of validationResult.notifications) {
        notification.setType('ERROR').setMessage(notif.message).add();
      }
    }

    if (notification.verifyErrors()) {
      const data = result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();
      throw new NotificationException(data);
    }

    return await this.transaction.runTransaction(async () => {
      const userCreated = await this.userService.createUser(createUserDto.name);

      if (!userCreated || !userCreated.success) {
        notification.setType('ERROR').setMessage('Ops! Não foi possível criar o usuário').setKey('name').add();
        if (notification.verifyErrors()) {
          const data = result
            .setCode(400)
            .setNotification(notification.build())
            .setSuccess(false)
            .build();
          throw new NotificationException(data);
        }
      }

      const credentialsCreated = await this.authService.createCredentials(
        createUserDto.identifier,
        userCreated.data,
      );

      if (!credentialsCreated || !credentialsCreated.success) {
        notification.setType('ERROR').setMessage('Ops! Não foi possível criar suas credenciais').setKey('identifier').add();
        if (notification.verifyErrors()) {
          const data = result
            .setCode(400)
            .setNotification(notification.build())
            .setSuccess(false)
            .build();
          throw new NotificationException(data);
        }
      }

      const passHashCreated = await this.authService.createPassword(
        createUserDto.password,
        createUserDto.passwordConfirm,
        userCreated.data,
      );

      if (!passHashCreated || !passHashCreated.success) {
        notification.setType('ERROR').setMessage('Ops! Não foi possível criar sua senha').setKey('password').add();
        if (notification.verifyErrors()) {
          const data = result
            .setCode(400)
            .setNotification(notification.build())
            .setSuccess(false)
            .build();
          throw new NotificationException(data);
        }
      }

      const userRolesCreated = await this.authService.createRoles(
        userCreated.data,
      );

      if (!userRolesCreated || !userRolesCreated.success) {
        notification.setType('ERROR').setMessage('Ops! Não foi possível criar sua role').setKey('role').add();
        if (notification.verifyErrors()) {
          const data = result
            .setCode(400)
            .setNotification(notification.build())
            .setSuccess(false)
            .build();
          throw new NotificationException(data);
        }
      }

      try {
        await this.persist.commit();

        notification
          .setType('INFO')
          .setMessage('Opa! Seu usuário já foi criado')
          .setKey('name')
          .add();

        return result
          .setCode(200)
          .setData(userCreated.data)
          .setNotification(notification.build())
          .setSuccess(true)
          .build();
      } catch (e) {
        console.error(e);
        notification
          .setType('ERROR')
          .setMessage(
            'Ops! Não foi possível criar seu usuário, tente novamente mais tarde',
          )
          .setKey('name')
          .add();

        const data = result
          .setCode(500)
          .setNotification(notification.build())
          .setSuccess(false)
          .build();

        throw new NotificationException(data);
      }
    });
  }
}

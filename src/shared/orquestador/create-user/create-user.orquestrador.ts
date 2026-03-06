import { TransactionContract } from '../../../shared/core/contracts/contracts.transaction';
import { UsersService } from '../../../users/service/users.service';
import { AuthService } from '../../../authentication/service/auth.service';
import { NotificationBuilderContract } from '../../../shared/core/contracts/contracts.notification';
import { ResultBuilderContract } from '../../../shared/core/contracts/contracts.result';
import { User } from '../../../users/entity/user.entity';
import { NotificationException } from '../../core/@custom-decorators/exception-custom/exception';
import { CreateUserDto } from './create-user.dto';
import { PersistContract } from '../../../shared/core/contracts/contracts.persistence';

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

    if (!createUserDto?.identifier) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Sua identificação é inválida')
        .add();

      result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false);

      const resultException = result.build();

      throw new NotificationException(resultException);
    }

    return await this.transaction.runTransaction(async () => {
      const userCreated = await this.userService.createUser(createUserDto.name);

      if (!userCreated) {
        notification
          .setType('ERROR')
          .setMessage('Ops! Não foi possível criar o usuário')
          .add();

        result
          .setCode(400)
          .setNotification(notification.build())
          .setSuccess(false);

        const resultException = result.build();

        throw new NotificationException(resultException);
      }

      const credentialsCreated = await this.authService.createCredentials(
        createUserDto.identifier,
        userCreated.data,
      );

      if (!credentialsCreated) {
        notification
          .setType('ERROR')
          .setMessage('Ops! Não foi possível criar suas credenciais')
          .add();

        result
          .setCode(400)
          .setNotification(notification.build())
          .setSuccess(false);

        const resultException = this.result().build();

        throw new NotificationException(resultException);
      }

      const passHashCreated = await this.authService.createPassword(
        createUserDto.password,
        createUserDto.passwordConfirm,
        userCreated.data,
      );

      if (!passHashCreated) {
        notification
          .setType('ERROR')
          .setMessage('Ops! Não foi possível criar suas credenciais')
          .add();

        result
          .setCode(400)
          .setNotification(notification.build())
          .setSuccess(false);

        const resultException = result.build();

        throw new NotificationException(resultException);
      }

      const userRoulesCreated = await this.authService.createRoles(
        userCreated.data,
      );

      if (!userRoulesCreated) {
        notification
          .setType('ERROR')
          .setMessage('Ops! Não foi possível criar suas credenciais')
          .add();

        result
          .setCode(400)
          .setNotification(notification.build())
          .setSuccess(false);

        const resultException = result.build();

        throw new NotificationException(resultException);
      }

      try {
        await this.persist.commit();

        notification
          .setType('INFO')
          .setMessage('Opa! Seu usuário já foi criado')
          .add();

        return result
          .setCode(200)
          .setData(userCreated.data)
          .setNotification(notification.build())
          .setSuccess(true)
          .build();
      } catch (e) {
        notification
          .setType('ERROR')
          .setMessage(
            'Ops! Não foi possível criar sue usuário, tente novamente mais tarde',
          )
          .add();

        result
          .setCode(500)
          .setNotification(notification.build())
          .setSuccess(false);

        const resultException = result.build();

        console.error(e);
        throw new NotificationException(resultException);
      }
    });
  }
}

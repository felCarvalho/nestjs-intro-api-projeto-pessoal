import { Module } from '@nestjs/common';
import { User } from '../../../users/entity/user.entity';
import { AuthService } from 'src/authentication/service/auth.service';
import { UsersService } from 'src/users/service/users.service';
import { CreateUserOrquestrador } from './create-user.orquestrador';
import { PersistContract } from '../../../shared/core/contracts/contracts.persistence';
import { TransactionContract } from '../../../shared/core/contracts/contracts.transaction';
import { NotificationBuilderContract } from '../../../shared/core/contracts/contracts.notification';
import { ResultBuilderContract } from '../../../shared/core/contracts/contracts.result';
import { ModuleCore } from '../../../shared/core/moduleCore/module.core';
import { AuthModule } from '../../../authentication/auth.module';
import { UsersModule } from '../../../users/users.module';
import { UserOrquestradoController } from './create-users.controller';

@Module({
  imports: [ModuleCore, AuthModule, UsersModule],
  controllers: [UserOrquestradoController],
  providers: [
    {
      provide: CreateUserOrquestrador,
      useFactory: (
        persist: PersistContract<any>,
        authService: AuthService,
        usersService: UsersService,
        transactionContract: TransactionContract,
        notificationBuilderContract: () => NotificationBuilderContract,
        resultBuilderContract: () => ResultBuilderContract<User>,
      ) => {
        return new CreateUserOrquestrador(
          persist,
          authService,
          usersService,
          transactionContract,
          notificationBuilderContract,
          resultBuilderContract,
        );
      },
      inject: [
        PersistContract,
        AuthService,
        UsersService,
        TransactionContract,
        NotificationBuilderContract,
        ResultBuilderContract,
      ],
    },
  ],
  exports: [],
})
export class CreateUserOrquestradorModule {}

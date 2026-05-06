import { EntityManager } from '@mikro-orm/postgresql';
import { Module } from '@nestjs/common';
import { ResultBuilderContract } from 'src/shared/core/contracts/contracts.result';
import { AuthModule } from '../authentication/auth.module';
import { NotificationBuilderContract } from '../shared/core/contracts/contracts.notification';
import { PersistContract } from '../shared/core/contracts/contracts.persistence';
import { UserCreateBuilder } from './builder/create.builder';
import {
  UserCreateBuilderContract,
  UserRepositoryContract,
} from './contracts/index.contract';
import { User } from './entity/user.entity';
import { UserRepository } from './repository/user.repository';
import { UsersService } from './service/users.service';
import { ModuleCore } from '../shared/core/moduleCore/module.core';

@Module({
  imports: [AuthModule, ModuleCore],
  controllers: [],
  providers: [
    {
      provide: UserRepositoryContract,
      useFactory: (em: EntityManager) => {
        return new UserRepository(em, User);
      },
      inject: [EntityManager],
    },
    {
      provide: UserCreateBuilderContract,
      useFactory: (
        resultBuilder: () => ResultBuilderContract<User>,
        notificationBuilder: () => NotificationBuilderContract,
        user: User,
      ) => {
        return () =>
          new UserCreateBuilder(resultBuilder(), notificationBuilder(), user);
      },
      inject: [ResultBuilderContract, NotificationBuilderContract],
    },
    {
      provide: UsersService,
      useFactory: (
        userRepo: UserRepositoryContract<User>,
        userCreateBuilder: () => UserCreateBuilderContract<User>,
        notification: () => NotificationBuilderContract,
        result: () => ResultBuilderContract<User>,
        persist: PersistContract<User>,
      ) => {
        return new UsersService(
          userRepo,
          userCreateBuilder,
          notification,
          result,
          persist,
        );
      },
      inject: [
        UserRepositoryContract,
        UserCreateBuilderContract,
        NotificationBuilderContract,
        ResultBuilderContract,
        PersistContract,
      ],
    },
  ],
  exports: [UsersService, UserCreateBuilderContract, UserRepositoryContract],
})
export class UsersModule {}

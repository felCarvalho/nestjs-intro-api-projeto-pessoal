import { EntityManager } from '@mikro-orm/postgresql';
import { Module } from '@nestjs/common';
import { RolesRepositoryContract } from 'src/authentication/contracts/roles.contracts';
import { ResultBuilderContract } from 'src/shared/core/contracts/contracts.result';
import { AuthModule } from '../authentication/auth.module';
import {
  CredentialsBuilderContracts,
  CredentialsRepositoryContract,
} from '../authentication/contracts/credentials.contracts';
import {
  PassHashBuilderContracts,
  PassHashRepositoryContract,
} from '../authentication/contracts/passHash.contract';
import {
  UserRolesBuilderContract,
  UserRolesRepositoryContract,
} from '../authentication/contracts/userRoules.contracts';
import { NotificationBuilderContract } from '../shared/core/contracts/contracts.notification';
import { PersistContract } from '../shared/core/contracts/contracts.persistence';
import { TransactionContract } from '../shared/core/contracts/contracts.transaction';
import {
  ICredentials,
  IPassHash,
  IRoles,
  IUserRoles,
} from '../shared/core/types/types';
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
        persist: PersistContract<any>,
        userRepo: UserRepositoryContract<User>,
        transaction: TransactionContract,
        credentialsRepo: CredentialsRepositoryContract<ICredentials>,
        passHashRepo: PassHashRepositoryContract<IPassHash>,
        userRolesRepo: UserRolesRepositoryContract<IUserRoles>,
        passHashBuilder: () => PassHashBuilderContracts<IPassHash>,
        credentialBuilder: () => CredentialsBuilderContracts<ICredentials>,
        userBuilder: () => UserCreateBuilderContract<User>,
        userRolesBuilder: () => UserRolesBuilderContract<IUserRoles>,
        roleRepo: RolesRepositoryContract<IRoles>,
        notification: () => NotificationBuilderContract,
        result: () => ResultBuilderContract<any>,
      ) => {
        return new UsersService(
          persist,
          userRepo,
          transaction,
          credentialsRepo,
          passHashRepo,
          userRolesRepo,
          passHashBuilder,
          credentialBuilder,
          userBuilder,
          userRolesBuilder,
          roleRepo,
          notification,
          result,
        );
      },
      inject: [
        PersistContract,
        UserRepositoryContract,
        TransactionContract,
        CredentialsRepositoryContract,
        PassHashRepositoryContract,
        UserRolesRepositoryContract,
        PassHashBuilderContracts,
        CredentialsBuilderContracts,
        UserCreateBuilderContract,
        UserRolesBuilderContract,
        RolesRepositoryContract,
        NotificationBuilderContract,
        ResultBuilderContract,
      ],
    },
  ],
  exports: [UsersService, UserCreateBuilderContract, UserRepositoryContract],
})
export class UsersModule {}

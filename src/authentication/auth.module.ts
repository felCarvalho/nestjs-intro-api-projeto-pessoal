import { EntityManager } from '@mikro-orm/postgresql';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as bcrypt from 'bcrypt';
import { BaseAuth } from '../shared/core/baseAuth/baseAuth';
import { BaseAuthContract } from '../shared/core/contracts/contracts.auth';
import { NotificationBuilderContract } from '../shared/core/contracts/contracts.notification';
import { PersistContract } from '../shared/core/contracts/contracts.persistence';
import { ResultBuilderContract } from '../shared/core/contracts/contracts.result';
import { ModuleCore } from '../shared/core/moduleCore/module.core';
import { IPassHash } from '../shared/core/types/types';
import { JwtAuthGuard } from './auth-guards/auth.jwt.guard';
import { jwtRefreshTokenGuard } from './auth-guards/auth.jwtRefreshToken.guard';
import { localAuthGuard } from './auth-guards/auth.local.guard';
import { jwtRefreshTokenStrategy } from './auth-strategys/auth.jwtRefreshTokenStrategy';
import { jwtStrategy } from './auth-strategys/auth.jwtStrategy';
import { LocalStrategy } from './auth-strategys/auth.loca.strategy.';
import { AuthController } from './auth.controller';
import { CredentialsBuilder } from './builderEntity/builder.credentials';
import { PassHashBuilder } from './builderEntity/builder.passHash';
import { RefreshTokenBuilder } from './builderEntity/builder.refreshToken';
import { UserRolesBuilder } from './builderEntity/builder.userRoles';
import {
  CredentialsBuilderContracts,
  CredentialsRepositoryContract,
} from './contracts/credentials.contracts';
import {
  PassHashBuilderContracts,
  PassHashRepositoryContract,
} from './contracts/passHash.contract';
import {
  RefreshTokenBuilderContracts,
  RefreshTokenRepositoryContract,
} from './contracts/refreshToken.contracts';
import { RolesRepositoryContract } from './contracts/roles.contracts';
import {
  UserRolesBuilderContract,
  UserRolesRepositoryContract,
} from './contracts/userRoules.contracts';
import { Credentials } from './entities/credentials.entity';
import { PassHash } from './entities/passHash.entity';
import { RefreshToken } from './entities/refreshToken.entity';
import { Roles } from './entities/roles.entity';
import { UserRoles } from './entities/userRoles.entity';
import { CredentialsRepository } from './repository/credentials.repository';
import { PassHashRepository } from './repository/passHash.repository';
import { RefreshTokenRepository } from './repository/refreshToken.repository';
import { RolesRepository } from './repository/roles.repository';
import { UserRolesRepository } from './repository/userRoules.repository';
import { AuthService } from './service/auth.service';

@Module({
  imports: [
    ModuleCore,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // Aqui o NestJS garante que o ConfigService já carregou o .env
        secret: configService.get<string>('JWT_SECRET'),
        expireIn: '',
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    LocalStrategy,
    jwtStrategy,
    jwtRefreshTokenStrategy,
    localAuthGuard,
    JwtAuthGuard,
    jwtRefreshTokenGuard,
    {
      provide: CredentialsBuilderContracts,
      useFactory: (
        result: () => ResultBuilderContract<Credentials>,
        notification: () => NotificationBuilderContract,
      ) => {
        return () => new CredentialsBuilder(result(), notification());
      },
      inject: [ResultBuilderContract, NotificationBuilderContract],
    },
    {
      provide: 'bcrypt',
      useValue: bcrypt,
    },
    {
      provide: PassHashBuilderContracts,
      useFactory: (
        result: () => ResultBuilderContract<IPassHash>,
        notification: () => NotificationBuilderContract,
        encrypt: typeof bcrypt,
        configService: ConfigService,
        entity: PassHash,
      ) => {
        return () =>
          new PassHashBuilder(
            notification(),
            result(),
            encrypt,
            configService,
            entity,
          );
      },
      inject: [
        ResultBuilderContract,
        NotificationBuilderContract,
        'bcrypt',
        ConfigService,
      ],
    },
    {
      provide: RefreshTokenBuilderContracts,
      useFactory: (
        result: () => ResultBuilderContract<RefreshToken>,
        notification: () => NotificationBuilderContract,
        encrypt: typeof bcrypt,
        configService: ConfigService,
        entity: RefreshToken,
      ) => {
        return () =>
          new RefreshTokenBuilder(
            notification(),
            result(),
            encrypt,
            configService,
            entity,
          );
      },
      inject: [
        ResultBuilderContract,
        NotificationBuilderContract,
        'bcrypt',
        ConfigService,
      ],
    },
    {
      provide: UserRolesBuilderContract,
      useFactory: (
        notification: () => NotificationBuilderContract,
        result: () => ResultBuilderContract<UserRoles>,
      ) => {
        return () => new UserRolesBuilder(notification(), result());
      },
      inject: [NotificationBuilderContract, ResultBuilderContract],
    },
    {
      provide: CredentialsRepositoryContract,
      useFactory: (em: EntityManager) => {
        return new CredentialsRepository(em, Credentials);
      },
      inject: [EntityManager],
    },
    {
      provide: PassHashRepositoryContract,
      useFactory: (em: EntityManager) => {
        return new PassHashRepository(em, PassHash);
      },
      inject: [EntityManager],
    },
    {
      provide: RefreshTokenRepositoryContract,
      useFactory: (em: EntityManager) => {
        return new RefreshTokenRepository(em, RefreshToken);
      },
      inject: [EntityManager],
    },
    {
      provide: UserRolesRepositoryContract,
      useFactory: (em: EntityManager) => {
        return new UserRolesRepository(em, UserRoles);
      },
      inject: [EntityManager],
    },
    {
      provide: RolesRepositoryContract,
      useFactory: (em: EntityManager) => {
        return new RolesRepository(em, Roles);
      },
      inject: [EntityManager],
    },
    {
      provide: BaseAuthContract,
      useFactory: (serviceToken: JwtService, configService: ConfigService) => {
        return new BaseAuth(serviceToken, configService);
      },
      inject: [JwtService, ConfigService],
    },
    {
      provide: AuthService,
      useFactory: (
        persist: PersistContract<any>,
        notification: () => NotificationBuilderContract,
        result: () => ResultBuilderContract<any>,
        refreshTokenRepo: RefreshTokenRepositoryContract<RefreshToken>,
        passHashRepo: PassHashRepositoryContract<IPassHash>,
        credentialsRepo: CredentialsRepositoryContract<Credentials>,
        userRolesRepo: UserRolesRepositoryContract<UserRoles>,
        rolesRepo: RolesRepositoryContract<Roles>,
        credentialsBuilder: () => CredentialsBuilderContracts<Credentials>,
        passHashBuilder: () => PassHashBuilderContracts<IPassHash>,
        refreshTokenBuilder: () => RefreshTokenBuilderContracts<RefreshToken>,
        userRolesBuilder: () => UserRolesBuilderContract<UserRoles>,
        baseAuth: BaseAuthContract,
      ) => {
        return new AuthService(
          persist,
          notification,
          result,
          refreshTokenRepo,
          passHashRepo,
          credentialsRepo,
          userRolesRepo,
          rolesRepo,
          credentialsBuilder,
          passHashBuilder,
          refreshTokenBuilder,
          userRolesBuilder,
          baseAuth,
        );
      },
      inject: [
        PersistContract,
        NotificationBuilderContract,
        ResultBuilderContract,
        RefreshTokenRepositoryContract,
        PassHashRepositoryContract,
        CredentialsRepositoryContract,
        UserRolesRepositoryContract,
        RolesRepositoryContract,
        CredentialsBuilderContracts,
        PassHashBuilderContracts,
        RefreshTokenBuilderContracts,
        UserRolesBuilderContract,
        BaseAuthContract,
      ],
    },
  ],
  exports: [
    AuthService,
    CredentialsRepositoryContract,
    PassHashRepositoryContract,
    UserRolesRepositoryContract,
    RolesRepositoryContract,
    CredentialsBuilderContracts,
    PassHashBuilderContracts,
    UserRolesBuilderContract,
    RolesRepositoryContract,
    LocalStrategy,
    jwtStrategy,
    jwtRefreshTokenStrategy,
    localAuthGuard,
    JwtAuthGuard,
    jwtRefreshTokenGuard,
  ],
})
export class AuthModule {}

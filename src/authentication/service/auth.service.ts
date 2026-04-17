import { BaseAuthContract } from '../../shared/core/contracts/contracts.auth';
import { NotificationException } from '../../shared/core/@custom-decorators/exception-custom/exception';
import { NotificationBuilderContract } from '../../shared/core/contracts/contracts.notification';
import { PersistContract } from '../../shared/core/contracts/contracts.persistence';
import { ResultBuilderContract } from '../../shared/core/contracts/contracts.result';
import {
  CredentialsBuilderContracts,
  CredentialsRepositoryContract,
} from '../contracts/credentials.contracts';
import {
  PassHashBuilderContracts,
  PassHashRepositoryContract,
} from '../contracts/passHash.contract';
import {
  RefreshTokenBuilderContracts,
  RefreshTokenRepositoryContract,
} from '../contracts/refreshToken.contracts';
import {
  UserRolesBuilderContract,
  UserRolesRepositoryContract,
} from '../contracts/userRoules.contracts';
import { LoginDto } from '../dto/login.dto';
import { Credentials } from '../entities/credentials.entity';
import { PassHash } from '../entities/passHash.entity';
import { RefreshToken } from '../entities/refreshToken.entity';
import { UserRoles } from '../entities/userRoles.entity';
import { payload } from '../../shared/core/contracts/contracts.auth';
import { RolesRepositoryContract } from '../contracts/roles.contracts';
import { Roles } from '../entities/roles.entity';
import { User } from '../../users/entity/user.entity';

export class AuthService {
  constructor(
    private readonly persist: PersistContract<any>,
    private readonly notification: () => NotificationBuilderContract,
    private readonly result: () => ResultBuilderContract<any>,
    private readonly refreshRepo: RefreshTokenRepositoryContract<RefreshToken>,
    private readonly passHashRepo: PassHashRepositoryContract<PassHash>,
    private readonly credentialsRepo: CredentialsRepositoryContract<Credentials>,
    private readonly userRolesRepo: UserRolesRepositoryContract<UserRoles>,
    private readonly rolesRepo: RolesRepositoryContract<Roles>,
    private readonly credentialsBuilder: () => CredentialsBuilderContracts<Credentials>,
    private readonly passHashBuilder: () => PassHashBuilderContracts<PassHash>,
    private readonly refreshTokenBuilder: () => RefreshTokenBuilderContracts<RefreshToken>,
    private readonly userRolesBuilder: () => UserRolesBuilderContract<UserRoles>,
    private readonly baseAuth: BaseAuthContract,
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

  async authValidate(loginDto: LoginDto) {
    const { identifier, password } = loginDto;
    const notification = this.notification();
    const result = this.result();

    const userCredentialsBuilder = this.credentialsBuilder();
    const userPassHashBuilder = this.passHashBuilder();

    if (!identifier || !password) {
      //criando notificação
      notification.setType('ERROR');
      notification.setMessage(
        'Ops! não foi possivel realizar a sua autenticação 57',
      );
      notification.add();

      //formatando objeto de reposta
      result.setCode(400);
      result.setNotification(notification.build());
      result.setSuccess(false);
      const resultException = result.build();

      throw new NotificationException(resultException);
    }

    //usando builder de credentials para fazer verificação de credenciais
    userCredentialsBuilder.setIdentifier(identifier);
    const verifyCredentials = userCredentialsBuilder.build();

    if (!verifyCredentials.success) {
      notification.setType('ERROR');
      notification.setMessage('Ops, email ou senha não válido 76');
      notification.add();
    }

    const findIdentifier = await this.credentialsRepo.findIdentifier(
      verifyCredentials.data.identifier,
      verifyCredentials.data.user.id,
    );

    if (!findIdentifier) {
      notification.setType('ERROR');
      notification.setMessage('Ops, email ou senha não válido');
      notification.add();
    }

    const findPassHash = await this.passHashRepo.findUserById(
      findIdentifier?.user.id ?? '',
    );

    if (!findPassHash) {
      //criando notificação
      notification.setType('ERROR');
      notification.setMessage(
        'Ops! não foi possivel realizar a sua autenticação 98',
      );
      notification.add();

      //formatando objeto de reposta
      result.setCode(400);
      result.setNotification(notification.build());
      result.setSuccess(false);
      const resultException = result.build();

      throw new NotificationException(resultException);
    }

    const comparePassHash = await userPassHashBuilder.setCompare(
      password,
      findPassHash.hash,
    );

    if (!comparePassHash) {
      //criando notificação
      notification.setType('ERROR');
      notification.setMessage(
        'Ops! não foi possivel realizar a sua autenticação',
      );
      notification.add();

      //formatando objeto de reposta
      result.setCode(400);
      result.setNotification(notification.build());
      result.setSuccess(false);
      const resultException = result.build();

      throw new NotificationException(resultException);
    }

    const findUserRoles = await this.userRolesRepo.findById(
      findIdentifier?.user.id ?? '',
    );

    if (!findUserRoles) {
      notification.setType('ERROR');
      notification.setMessage('Ops! role não encontrada');
      notification.add();
    }

    if (notification.verifyErrors()) {
      //criando notificação
      notification.setType('ERROR');
      notification.setMessage(
        'Ops! não foi possivel realizar a sua autenticação 147',
      );
      notification.add();
      const erroLogAuth = notification.build();
      console.error(erroLogAuth);

      //formatando objeto de reposta
      result.setCode(400);
      result.setNotification(erroLogAuth);
      result.setSuccess(false);
      const resultException = result.build();

      throw new NotificationException(resultException);
    }

    return {
      sub: findIdentifier?.user.id,
      identifier: findIdentifier?.identifier,
      role: findUserRoles?.role.slug,
      username: findIdentifier?.user.name,
    };
  }

  async createToken(payload: Partial<payload>) {
    const notification = this.notification();
    const result = this.result();

    const { exp, iat, ...payloadRest } = payload;

    const token = await this.baseAuth.generateToken(payloadRest);

    if (!token) {
      notification.setType('ERROR');
      notification.setMessage(
        'Ops, tivemos um problema ao gerar seu token 178',
      );
      notification.add();

      result.setCode(500);
      result.setNotification(notification.build());
      result.setSuccess(false);
      const resultException = result.build();

      throw new NotificationException(resultException);
    }

    const decodeToken = await this.baseAuth.decodeToken(token);

    return {
      token: token,
      payload: decodeToken,
    };
  }
  async createRefreshToken(payload: payload, idUser: string) {
    const notification = this.notification();
    const result = this.result();

    if (!payload || !idUser) {
      notification
        .setType('ERROR')
        .setMessage(
          'Ops, tivemos um problema ao gerar sua autenticação automaticamente',
        )
        .add();

      result
        .setCode(500)
        .setNotification(notification.build())
        .setSuccess(false);
      const resultException = result.build();

      throw new NotificationException(resultException);
    }

    const refreshTokenBuilder = this.refreshTokenBuilder();
    refreshTokenBuilder.generateId();
    const idRefreshToken = refreshTokenBuilder.build().data.id;

    const tokenRefresh = await this.baseAuth.generateRefreshToken({
      ...payload,
      idToken: idRefreshToken,
    });

    if (!tokenRefresh) {
      notification
        .setType('ERROR')
        .setMessage('Ops, tivemos um problema ao gerar seu token')
        .add();

      result
        .setCode(500)
        .setNotification(notification.build())
        .setSuccess(false);
      const resultException = result.build();

      throw new NotificationException(resultException);
    }

    if (!idUser) {
      notification
        .setType('ERROR')
        .setMessage(
          'Ops, Não encontramos seu usupário para criar seu token de longa duração',
        )
        .add();

      result
        .setCode(404)
        .setNotification(notification.build())
        .setSuccess(false);
      const resultException = result.build();

      throw new NotificationException(resultException);
    }

    const date = new Date().toISOString();

    //continuação do builder de refresh token
    const refreshTokenData = this.refreshTokenBuilder();
    await refreshTokenData.setHash(tokenRefresh);
    refreshTokenData.setStatus('ATIVO');
    refreshTokenData.setUser(idUser);
    refreshTokenData.setCreateDate(date);
    refreshTokenData.setUpdateDate(date);
    const refreshTokenBuild = refreshTokenData.build();

    if (!refreshTokenBuild.success) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Não foi gerar seu novo token de longa duração')
        .add();

      const resultException = result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(resultException);
    }

    notification.setType('INFO').setMessage('Refresh token criado').add();

    const data = result
      .setCode(200)
      .setData({ ...refreshTokenBuild.data, id: idRefreshToken })
      .setNotification(notification.build())
      .setSuccess(true)
      .build();

    this.refreshRepo.createRefreshToken(data.data as RefreshToken);

    try {
      await this.persist.commit();

      return tokenRefresh;
    } catch (e) {
      console.error(e);
      notification
        .setType('ERROR')
        .setMessage(
          'Ops! Tivemos problemas ao salvar seu token de longa duração',
        )
        .add();

      const resultException = result
        .setCode(500)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(resultException);
    }
  }

  async validateRefreshToken(
    refreshToken: string,
    idUser: string,
    identifier: string,
    role: string,
    idToken: string,
  ) {
    const notification = this.notification();
    const result = this.result();

    if (!refreshToken || !idUser || !identifier || !role || !idToken) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Não foi possivel renovar sua sessão automaticamente')
        .add();

      const resultException = result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(resultException);
    }

    const findUserRole = await this.userRolesRepo.findById(idUser);

    if (!findUserRole) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Impossivel renovar sua sessão sem um rota válida')
        .add();

      const resultException = result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(resultException);
    }

    if (findUserRole.user.id !== idUser) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Seu usuário não tem acesso a essa rota')
        .add();

      const resultException = result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(resultException);
    }

    const findCredentials = await this.credentialsRepo.findIdentifier(
      identifier,
      idUser,
    );

    if (!findCredentials) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Não encontramos uma identificação válida ')
        .add();

      const resultException = result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(resultException);
    }

    if (findCredentials.user.id !== idUser) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Essa identificação não pertence ao seu usuário')
        .add();

      const resultException = result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(resultException);
    }

    const findToken = await this.refreshRepo.findById(idToken, idUser);

    if (!findToken) {
      notification.setType('ERROR').setMessage('Ops! Token inválido').add();

      const resultException = result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(resultException);
    }
  }

  async createCredentials(identifier: string, user: User) {
    const notification = this.notification();
    const result = this.result();

    if (!identifier) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Credencial inválida')
        .add();

      const resultException = result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(resultException);
    }

    if (!user.id) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Seu usuário não é válido')
        .add();

      const resultException = result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(resultException);
    }

    const findCredentials = await this.credentialsRepo.findIdentifier(
      identifier,
      user.id,
    );

    if (findCredentials) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Credencial já existe')
        .add();
    }

    if (notification.verifyErrors() || notification.verifyWarnings()) {
      const resultException = result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(resultException);
    }

    const date = new Date().toISOString();

    const credentialBuilder = this.credentialsBuilder();
    credentialBuilder.generateId();
    credentialBuilder.setIdentifier(identifier);
    credentialBuilder.setProvider('local');
    credentialBuilder.setUser(user);
    credentialBuilder.setCreateDate(date);
    credentialBuilder.setUpdateDate(date);
    const credentialsBuild = credentialBuilder.build();

    if (!credentialsBuild.success) {
      return credentialsBuild;
    }

    if (this.verifyMaxLength(credentialsBuild.data.identifier)) {
      notification
        .setType('WARNING')
        .setMessage('Ops! Sua credential esta muito longa')
        .add();

      const resultException = result
        .setCode(404)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(resultException);
    }

    if (!this.verifyMaxLength(credentialsBuild.data.identifier)) {
      notification
        .setType('INFO')
        .setMessage('Ops! Sua credencial foi criada')
        .add();
    }

    if (notification.verifyErrors() || notification.verifyWarnings()) {
      const resultException = result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(resultException);
    }

    const data = result
      .setCode(200)
      .setData(credentialsBuild.data)
      .setNotification(notification.build())
      .setSuccess(true)
      .build();

    this.credentialsRepo.createCredentials(data.data as Credentials);
    console.log('credentials rodou');
    return data;
  }

  async createPassword(
    password: string,
    passwordConfirmation: string,
    user: User,
  ) {
    console.log('inicio');
    const notification = this.notification();
    const result = this.result();

    if (!password || !passwordConfirmation) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Sua senha está inválida')
        .add();

      result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false);

      const resultException = result.build();
      throw new NotificationException(resultException);
    }

    const verifyPassword = password === passwordConfirmation;

    if (!verifyPassword) {
      notification
        .setType('WARNING')
        .setMessage('Ops! Senhas não coincidem')
        .add();
    }

    if (notification.verifyErrors() || notification.verifyWarnings()) {
      result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false);

      const resultException = result.build();
      throw new NotificationException(resultException);
    }

    console.log('chegou até aqui');

    const date = new Date().toISOString();

    const passwordBuilder = this.passHashBuilder();
    passwordBuilder.generateId();
    await passwordBuilder.setHash(password);
    passwordBuilder.setUser(user);
    passwordBuilder.setCreateDate(date);
    passwordBuilder.setUpdateDate(date);
    const passwordBuild = passwordBuilder.build();

    if (!passwordBuild.success) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Tivemos um problema ao criar sua senha')
        .add();
    }

    if (this.verifyMinLength(passwordBuild.data.hash)) {
      notification
        .setType('WARNING')
        .setMessage('Ops! Sua senha está muito curta')
        .add();
    }

    if (this.verifyMaxLength(passwordBuild.data.hash)) {
      notification
        .setType('WARNING')
        .setMessage('Ops! Sua senha está muito longa')
        .add();
    }

    if (notification.verifyErrors() || notification.verifyWarnings()) {
      result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false);

      const resultException = result.build();

      throw new NotificationException(resultException);
    }

    notification.setType('INFO').setMessage('Opa! Sua senha foi criada').add();

    const data = result
      .setCode(200)
      .setData(passwordBuild.data)
      .setNotification(notification.build())
      .setSuccess(true)
      .build();

    console.log('chegou até aqui no pass');

    this.passHashRepo.createPassHash(data.data as PassHash);
    return data;
  }

  async createRoles(user: User) {
    const notification = this.notification();
    const result = this.result();

    if (!user.id) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Não conseguimos criar sua rota')
        .add();

      result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false);

      const resultException = this.result().build();

      throw new NotificationException(resultException);
    }

    const findUserRoles = await this.rolesRepo.findBySlug('user');

    if (!findUserRoles) {
      notification
        .setType('ERROR')
        .setMessage(
          'Ops! Tivemos um problema ao encontrar uma rota para seu usuário',
        )
        .add();

      result
        .setCode(500)
        .setNotification(notification.build())
        .setSuccess(false);

      const resultException = result.build();

      throw new NotificationException(resultException);
    }
    const date = new Date().toISOString();

    const userRolesBuilder = this.userRolesBuilder()
      .setRoleId(findUserRoles)
      .setUser(user)
      .setCreateDate(date)
      .setUpdateDate(date)
      .build();

    if (!userRolesBuilder.success) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Não conseguimos criar sua rota')
        .add();

      result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false);

      const resultException = result.build();

      throw new NotificationException(resultException);
    }
    if (!notification.verifyErrors() || !notification.verifyWarnings()) {
      notification.setType('INFO').setMessage('Opa! Sua rota foi criada').add();

      const data = result
        .setCode(200)
        .setData(userRolesBuilder.data)
        .setNotification(notification.build())
        .setSuccess(true)
        .build();

      this.userRolesRepo.createUserRoles(data.data as UserRoles);
      return data;
    }
  }
}

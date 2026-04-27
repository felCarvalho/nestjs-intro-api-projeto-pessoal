import { User } from '../../users/entity/user.entity';
import { ResultData } from '../../shared/core/result/result';

//contrato para builder
export abstract class CredentialsBuilderContracts<T> {
  abstract setIdentifier(identifier: string): this;
  abstract setProvider(provider: 'local'): this;
  abstract setCreateDate(date: Date): this;
  abstract setUpdateDate(date: Date): this;
  abstract setUser(user: User): this;
  abstract generateId(): this;
  abstract build(): ResultData<T>;
}

export abstract class CredentialsRepositoryContract<T> {
  abstract findById(id: string, idUser: string): Promise<T | null>;
  abstract findAllId(id: string, idUser: string): Promise<T[]>;
  abstract findIdentifier(identifier: string): Promise<T | null>;
  abstract findUserById(id: string, idUser: string): Promise<T | null>;
  abstract createCredentials(credentials: T): void;
}

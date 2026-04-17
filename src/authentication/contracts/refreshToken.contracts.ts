import { ResultData } from '../../shared/core/result/result';
import { HashContract } from '../../shared/core/contracts/contracts.hash';

export abstract class RefreshTokenRepositoryContract<T> {
  abstract findById(id: string, idUser: string): Promise<T | null>;
  abstract findAllId(id: string, idUser: string): Promise<T[]>;
  abstract findUserById(idUser: string): Promise<T | null>;
  abstract createRefreshToken(token: T): void;
}

export abstract class RefreshTokenBuilderContracts<T> extends HashContract {
  abstract setStatus(status: 'ATIVO' | 'INATIVO'): this;
  abstract generateId(): this | void;
  abstract setCreateDate(date: string): this;
  abstract setUser(user: string): this;
  abstract setUpdateDate(date: string): this;
  abstract build(): ResultData<T>;
}

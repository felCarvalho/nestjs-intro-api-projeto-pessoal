import { IUser } from '../../shared/core/types/types';
import { ResultData } from '../../shared/core/result/result';
import { HashContract } from '../../shared/core/contracts/contracts.hash';

export abstract class PassHashRepositoryContract<T> {
  abstract findById(id: string, idUser: string): Promise<T | null>;
  abstract findAllId(id: string, idUser: string): Promise<T[]>;
  abstract findUserById(id: string): Promise<T | null>;
  abstract createPassHash(passHash: T): void;
}

export abstract class PassHashBuilderContracts<T> extends HashContract {
  abstract setCreateDate(date: string): this;
  abstract generateId(): this | void;
  abstract setUpdateDate(date: string): this;
  abstract setUser(user: IUser): this;
  abstract build(): ResultData<T>;
}

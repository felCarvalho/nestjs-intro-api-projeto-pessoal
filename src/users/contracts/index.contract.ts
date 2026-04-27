import { ResultData } from 'src/shared/core/result/result';

//contrato de userEntity
export abstract class UserRepositoryContract<T> {
  abstract findById(id: string): Promise<T | null>;
  abstract findAllId(id: string): Promise<T[]>;
  abstract findName(name: string): Promise<T | null>;
  abstract createUser(data: T): void;
}

//contrato de userCreateBuilder
export abstract class UserCreateBuilderContract<T> {
  abstract setName(name: string): this | void;
  abstract setCreateDate(date: Date): this | void;
  abstract setUpdateDate(date: Date): this | void;
  abstract setDeleteDate(date: Date): this | void;
  abstract generateId(): this | void;
  abstract build(): ResultData<T>;
}

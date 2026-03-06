import { ResultData } from '../../shared/core/result/result';
import { UserRoles } from '../entities/userRoles.entity';

export abstract class UserRolesRepositoryContract<T> {
  abstract findById(id: string): Promise<T | null>;
  abstract findAllById(id: string): Promise<T[]>;
  abstract createUserRoles(userRoles: UserRoles): void;
}

export abstract class UserRolesBuilderContract<T> {
  abstract setUser(user: object): this;
  abstract setRoleId(role: object): this;
  abstract setCreateDate(date: string): this;
  abstract setUpdateDate(date: string): this;
  abstract setDeleteDate(date: string): this;
  abstract build(): ResultData<T>;
}

import { ResultData } from '../../shared/core/result/result';
import { UserRoles } from '../entities/userRoles.entity';
import { User } from '../../users/entity/user.entity';
import { Roles } from '../entities/roles.entity';

export abstract class UserRolesRepositoryContract<T> {
  abstract findById(id: string): Promise<T | null>;
  abstract findAllById(id: string): Promise<T[]>;
  abstract createUserRoles(userRoles: UserRoles): void;
}

export abstract class UserRolesBuilderContract<T> {
  abstract setUser(user: User): this;
  abstract setRoleId(role: Roles): this;
  abstract setCreateDate(date: Date): this;
  abstract setUpdateDate(date: Date): this;
  abstract setDeleteDate(date: Date | null): this;
  abstract build(): ResultData<T>;
}

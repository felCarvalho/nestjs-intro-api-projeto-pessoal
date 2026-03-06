import { UserRolesRepositoryContract } from '../contracts/userRoules.contracts';
import { UserRoles } from '../entities/userRoles.entity';
import { EntityRepository } from '@mikro-orm/postgresql';

export class UserRolesRepository
  extends EntityRepository<UserRoles>
  implements UserRolesRepositoryContract<UserRoles>
{
  async findById(id: string) {
    return await this.findOne({ user: { id } });
  }

  async findAllById(id: string) {
    return await this.findAll({ where: { user: { id } } });
  }

  createUserRoles(userRoles: UserRoles) {
    this.create(userRoles);
  }
}

import { Roles } from '../entities/roles.entity';
import { RolesRepositoryContract } from '../contracts/roles.contracts';
import { EntityRepository } from '@mikro-orm/postgresql';

export class RolesRepository
  extends EntityRepository<Roles>
  implements RolesRepositoryContract<Roles>
{
  async findBySlug(slug: 'user' | 'admin') {
    return await this.findOne({ slug });
  }
}

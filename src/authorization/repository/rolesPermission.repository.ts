import { EntityRepository } from '@mikro-orm/postgresql';
import { RolesPermissionsRepositoryContract } from '../contracts/permissions.contracts';
import { RolesPermissions } from '../entities/rolesPermissions.entity';

export class RolesPermissionsRepository
  extends EntityRepository<RolesPermissions>
  implements RolesPermissionsRepositoryContract<RolesPermissions>
{
  async findByRole(slug: string) {
    return await this.findOne({ role: { slug } });
  }
}

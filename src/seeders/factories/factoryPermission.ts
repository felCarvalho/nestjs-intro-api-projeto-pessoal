import { Factory } from '@mikro-orm/seeder';
import { Permissions } from '../../authorization/entities/permissions.entity';

export class PermissionsFactory extends Factory<Permissions> {
  model = Permissions;

  definition(): Partial<Permissions> {
    return {
      name: '',
      slug: '',
    };
  }
}

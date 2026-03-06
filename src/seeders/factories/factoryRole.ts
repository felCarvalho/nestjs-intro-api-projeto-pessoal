import { Factory } from '@mikro-orm/seeder';
import { Roles } from '../../authentication/entities/roles.entity';

export class RoleFactory extends Factory<Roles> {
  model = Roles;

  definition(): Partial<Roles> {
    return {
      name: '',
      slug: '',
    };
  }
}

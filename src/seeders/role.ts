import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { RoleFactory } from './factories/factoryRole';
import { Roles } from '../authentication/entities/roles.entity';

/* npx mikro-orm seeder:create DatabaseSeeder  # generates the class DatabaseSeeder
npx mikro-orm seeder:create test            # generates the class TestSeeder
npx mikro-orm seeder:create project-names   # generates the class ProjectNamesSeeder*/

export const roles = [
  {
    name: 'usuario',
    slug: 'user',
  },
  {
    name: 'Felipe',
    slug: 'admin',
  },
  {
    name: 'Minha_Rotina_APP',
    slug: 'guest',
  },
];

const date = new Date().toISOString();

export class RoleSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    for (const rolesName of roles) {
      const existingRole = await em.findOne(Roles, { slug: rolesName.slug });
      if (!existingRole) {
        await new RoleFactory(em).create(1, {
          name: rolesName.name,
          slug: rolesName.slug,
          createAt: date,
          updateAt: date,
          deleteAt: date,
        });
      }
    }
  }
}

import { EntityManager } from '@mikro-orm/postgresql';
import { Seeder } from '@mikro-orm/seeder';
import { Roles } from '../authentication/entities/roles.entity';
import { Permissions } from '../authorization/entities/permissions.entity';
import { RolesPermissions } from '../authorization/entities/rolesPermissions.entity';
import { PermissionBase } from '../shared/core/permissions/permission';

export class RolesPermissionSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const adminRole = await em.findOne(Roles, { slug: 'admin' });
    const userRole = await em.findOne(Roles, { slug: 'user' });
    const date = new Date().toISOString();

    if (!adminRole || !userRole) {
      console.error('Roles admin or user not found. Run RoleSeeder first.');
      return;
    }

    const valuesSlug = Object.values(PermissionBase);

    const allPermissions = await em.find(Permissions, {});
    const basePermissions = await em.find(Permissions, {
      slug: { $in: valuesSlug },
    });

    for (const permission of basePermissions) {
      const existingPermission = await em.findOne(RolesPermissions, {
        role: userRole,
        permission,
      });

      if (!existingPermission) {
        em.create(RolesPermissions, {
          role: userRole,
          permission,
          createAt: date,
          updateAt: date,
        });

        await em.flush();
      }
    }

    for (const permission of allPermissions) {
      const existingPermission = await em.findOne(RolesPermissions, {
        role: adminRole,
        permission,
      });

      if (!existingPermission) {
        em.create(RolesPermissions, {
          role: adminRole,
          permission,
          createAt: date,
          updateAt: date,
        });

        await em.flush();
      }
    }
  }
}

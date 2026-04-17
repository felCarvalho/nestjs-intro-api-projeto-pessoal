import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { RoleSeeder } from './role';
import { RolesPermissionSeeder } from './roles-permission.seeder';
import { PermissionsSeeder } from './permission';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    return this.call(em, [
      RoleSeeder,
      PermissionsSeeder,
      RolesPermissionSeeder,
    ]);
  }
}

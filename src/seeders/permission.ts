import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { PermissionsFactory } from './factories/factoryPermission';
import {
  PermissionBase,
  PermissionAdmin,
} from '../shared/core/permissions/permission';
import { Permissions } from '../authorization/entities/permissions.entity';
/* npx mikro-orm seeder:create DatabaseSeeder  # generates the class DatabaseSeeder
npx mikro-orm seeder:create test            # generates the class TestSeeder
npx mikro-orm seeder:create project-names   # generates the class ProjectNamesSeeder*/

export const permissions = [
  { name: 'criar-rotina', slug: PermissionBase.CREATE_TASK },
  { name: 'atualizar-rotina', slug: PermissionBase.UPDATE_TASK },
  { name: 'remover-rotina', slug: PermissionBase.REMOVE_TASK },
  { name: 'restaurar-rotina', slug: PermissionBase.RESTORE_TASK },
  { name: 'visualizar-rotina', slug: PermissionBase.VIEW_TASK },

  { name: 'criar-categoria', slug: PermissionBase.CREATE_CATEGORY },
  { name: 'atualizar-categoria', slug: PermissionBase.UPDATE_CATEGORY },
  { name: 'remover-categoria', slug: PermissionBase.REMOVE_CATEGORY },
  { name: 'restaurar-categoria', slug: PermissionBase.RESTORE_CATEGORY },
  { name: 'visualizar-categoria', slug: PermissionBase.VIEW_CATEGORY },

  { name: 'efetivar-usuario', slug: PermissionAdmin.EFETIVAR_USER },
  { name: 'desativar-usuario', slug: PermissionAdmin.DESATIVAR_USER },
  { name: 'deletar-usuario', slug: PermissionAdmin.DELETAR_USER },
  { name: 'criar-usuario', slug: PermissionAdmin.CRIAR_USER },
  { name: 'restaurar-usuario', slug: PermissionAdmin.RESTAURAR_USER },
  { name: 'visualizar-usuario', slug: PermissionAdmin.VISUALIZAR_USER },
];
const date = new Date().toISOString();

export class PermissionsSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    for (const permissionName of permissions) {
      const existingPermission = await em.findOne(Permissions, {
        slug: permissionName.slug,
      });
      if (!existingPermission) {
        await new PermissionsFactory(em).create(1, {
          name: permissionName.name,
          slug: permissionName.slug,
          createAt: date,
          updateAt: date,
          deleteAt: date,
        });
      }
    }
  }
}

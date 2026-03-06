import { RolesPermissions } from '../entities/rolesPermissions.entity';
import { EntitySchema } from '@mikro-orm/core';
import { Permissions } from '../entities/permissions.entity';
import { Roles } from '../../authentication/entities/roles.entity';

export const RolesPermissionsSchema = new EntitySchema<RolesPermissions>({
  name: 'rolesPermissions',
  class: RolesPermissions,
  tableName: 'roles_permissions',
  properties: {
    role: {
      kind: 'm:1',
      entity: () => Roles,
      primary: true,
    },
    permission: {
      kind: 'm:1',
      entity: () => Permissions,
      primary: true,
    },
    updateAt: { type: 'timestamptz', defaultRaw: 'now()' },
    createAt: { type: 'timestamptz', defaultRaw: 'now()' },
    deleteAt: { type: 'timestamptz', nullable: true, default: null },
  },
});

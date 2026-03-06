import { EntitySchema } from '@mikro-orm/core';
import { Permissions } from '../entities/permissions.entity';

export const PermissionSchema = new EntitySchema<Permissions>({
  name: 'permissions',
  class: Permissions,
  tableName: 'permissions',
  properties: {
    name: {
      type: 'string',
      length: 255,
      unique: true,
    },
    slug: {
      type: 'string',
      length: 255,
      primary: true,
    },
    updateAt: { type: 'timestamptz', defaultRaw: 'now()' },
    createAt: { type: 'timestamptz', defaultRaw: 'now()' },
    deleteAt: { type: 'timestamptz', nullable: true, default: null },
  },
});

import { Roles } from '../../authentication/entities/roles.entity';
import { EntitySchema } from '@mikro-orm/core';

export const RoleSchema = new EntitySchema<Roles>({
  name: 'roles',
  class: Roles,
  tableName: 'roles',
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

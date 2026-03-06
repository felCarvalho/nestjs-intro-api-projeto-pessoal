import { UserRoles } from '../entities/userRoles.entity';
import { EntitySchema } from '@mikro-orm/core';
import { User } from '../../users/entity/user.entity';
import { Roles } from '../entities/roles.entity';

export const UserRolesSchema = new EntitySchema<UserRoles>({
  name: 'userRoles',
  class: UserRoles,
  tableName: 'user_roles',
  properties: {
    user: {
      kind: 'm:1',
      entity: () => User,
      primary: true,
    },
    role: {
      kind: 'm:1',
      entity: () => Roles,
      primary: true,
    },
    updateAt: { type: 'timestamptz', defaultRaw: 'now()' },
    createAt: { type: 'timestamptz', defaultRaw: 'now()' },
    deleteAt: { type: 'timestamptz', nullable: true, default: null },
  },
});

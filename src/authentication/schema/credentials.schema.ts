import { Credentials } from '../entities/credentials.entity';
import { EntitySchema } from '@mikro-orm/core';
import { CredentialsRepository } from '../repository/credentials.repository';
import { User } from '../../users/entity/user.entity';
import { baseEntity } from '../../shared/core/baseEntity/base.schema';

export const credentialsSchema = new EntitySchema<Credentials>({
  name: 'credentials',
  class: Credentials,
  extends: baseEntity,
  tableName: 'credentials',
  properties: {
    id: {
      type: 'uuid',
      primary: true,
      defaultRaw: 'gen_random_uuid()',
    },
    provider: { type: 'string', default: 'local' },
    identifier: { type: 'string' },
    user: {
      kind: 'm:1',
      entity: () => User,
    },
    updateAt: { type: 'timestamptz', defaultRaw: 'now()' },
    createAt: { type: 'timestamptz', defaultRaw: 'now()' },
    deleteAt: { type: 'timestamptz', nullable: true, default: null },
  },
  repository: () => CredentialsRepository,
});

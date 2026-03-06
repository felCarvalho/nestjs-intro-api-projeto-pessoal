import { EntitySchema } from '@mikro-orm/core';
import { PassHash } from '../entities/passHash.entity';
import { PassHashRepository } from '../repository/passHash.repository';
import { baseEntity } from '../../shared/core/baseEntity/base.schema';
import { User } from '../../users/entity/user.entity';

export const PassHashSchema = new EntitySchema<PassHash>({
  name: 'passHash',
  extends: baseEntity,
  tableName: 'passHash',
  class: PassHash,
  properties: {
    id: { type: 'uuid', primary: true, defaultRaw: 'gen_random_uuid()' },
    hash: { type: 'string', default: '' },
    user: {
      kind: 'm:1',
      entity: () => User,
    },
    updateAt: { type: 'timestamptz', defaultRaw: 'now()' },
    createAt: { type: 'timestamptz', defaultRaw: 'now()' },
    deleteAt: { type: 'timestamptz', nullable: true, default: null },
  },
  repository: () => PassHashRepository,
});

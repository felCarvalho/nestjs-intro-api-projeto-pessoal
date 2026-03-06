import { EntitySchema } from '@mikro-orm/core';
import { RefreshToken } from '../entities/refreshToken.entity';
import { RefreshTokenRepository } from '../repository/refreshToken.repository';
import { User } from '../../users/entity/user.entity';
import { baseEntity } from '../../shared/core/baseEntity/base.schema';

export const RefreshTokenSchema = new EntitySchema<RefreshToken>({
  name: 'RefreshToken',
  tableName: 'refresh_tokens',
  class: RefreshToken,
  extends: baseEntity,
  properties: {
    id: { type: 'uuid', primary: true, defaultRaw: 'gen_random_uuid()' },

    hash: {
      type: 'string',
      length: 255,
      default: '',
    },
    status: {
      type: 'string',
      length: 255,
    },
    user: {
      kind: 'm:1',
      entity: () => User,
    },
    updateAt: { type: 'timestamptz', defaultRaw: 'now()' },
    createAt: { type: 'timestamptz', defaultRaw: 'now()' },
    deleteAt: { type: 'timestamptz', nullable: true, default: null },
  },
  repository: () => RefreshTokenRepository,
});

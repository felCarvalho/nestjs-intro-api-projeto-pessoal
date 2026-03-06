import { Category } from '../entity/category.entity';
import { EntitySchema } from '@mikro-orm/core';
import { CategoryRepository } from '../repository/category.repository';
import { baseEntity } from '../../shared/core/baseEntity/base.schema';
import { User } from '../../users/entity/user.entity';

export const categorySchema = new EntitySchema<Category>({
  name: 'category',
  class: Category,
  extends: baseEntity,
  tableName: 'categories',
  properties: {
    id: {
      type: 'uuid',
      primary: true,
      defaultRaw: 'gen_random_uuid()',
    },
    title: {
      type: 'string',
      length: 255,
      unique: true,
    },
    description: {
      type: 'string',
      length: 150,
    },
    user: { type: 'uuid', kind: 'm:1', entity: () => User },
    updateAt: { type: 'timestamptz', defaultRaw: 'now()' },
    createAt: { type: 'timestamptz', defaultRaw: 'now()' },
    deleteAt: { type: 'timestamptz', nullable: true, default: null },
  },
  repository: () => CategoryRepository,
});

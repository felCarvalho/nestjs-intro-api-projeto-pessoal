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
    },
    description: {
      type: 'string',
      length: 150,
    },
    user: { kind: 'm:1', entity: () => User },
    status: { type: 'string', nullable: true, default: null },
    updateAt: { type: 'timestamptz', defaultRaw: 'now()' },
    createAt: { type: 'timestamptz', defaultRaw: 'now()' },
    deleteAt: { type: 'timestamptz', nullable: true, default: null },
  },
  filters: {
    categoryIsNotDeleted: {
      name: 'categoryIsNotDeleted',
      cond: { deleteAt: { $eq: null } },
      default: true,
    },
    categoryIsInactive: {
      name: 'categoryIsInactive',
      cond: { status: { $eq: 'Inativa' } },
      default: false,
    },
    categoryDeleted: {
      name: 'categoryDeleted',
      cond: { deleteAt: { $ne: null } },
      default: false,
    },
  },
  repository: () => CategoryRepository,
});

import { EntitySchema } from '@mikro-orm/core';
import { Tasks } from '../entity/tasks.entity';
import { TasksRepository } from '../repository/task.repository';
import { baseEntity } from '../..//shared/core/baseEntity/base.schema';
import { User } from '../../users/entity/user.entity';
import { Category } from '../../category/entity/category.entity';

export const taskSchema = new EntitySchema<Tasks>({
  name: 'Task',
  class: Tasks,
  extends: baseEntity,
  tableName: 'tasks',
  properties: {
    id: {
      type: 'uuid',
      primary: true,
      defaultRaw: 'gen_random_uuid()',
    },
    title: { type: 'string', length: 255, index: true },
    description: { type: 'string', length: 255 },
    user: { kind: 'm:1', entity: () => User },
    category: {
      kind: 'm:1',
      entity: () => Category,
      default: null,
      nullable: true,
    },
    completed: { type: 'string' },
    updateAt: { type: 'timestamptz', defaultRaw: 'now()' },
    createAt: { type: 'timestamptz', defaultRaw: 'now()' },
    deleteAt: { type: 'timestamptz', nullable: true, default: null },
  },
  filters: {
    taskActive: {
      name: 'taskActive',
      cond: { deleteAt: null },
      default: true,
    },
    taskDeleted: {
      name: 'taskDeleted',
      cond: { deleteAt: { $ne: null } },
      default: false,
    },
    isCategory: {
      name: 'taskIsCategory',
      cond: { category: { $ne: null } },
      default: true,
    },
  },
  repository: () => TasksRepository,
});

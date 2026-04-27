import { EntitySchema } from '@mikro-orm/core';

export interface IBaseEntity {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date | null;
}

export class baseEntity implements IBaseEntity {
  id: string = '';
  createAt: Date = new Date();
  updateAt: Date = new Date();
  deleteAt: Date | null = null;
}

export const baseEntitySchema = new EntitySchema({
  name: 'baseEntity',
  class: baseEntity,
  abstract: true,
  properties: {
    id: { type: 'uuid', primary: true, defaultRaw: 'gen_random_uuid()' },
    createAt: { type: 'timestamptz', defaultRaw: 'now()' },
    updateAt: { type: 'timestamptz', defaultRaw: 'now()' },
    deleteAt: { type: 'timestamptz', nullable: true, default: null },
  },
});

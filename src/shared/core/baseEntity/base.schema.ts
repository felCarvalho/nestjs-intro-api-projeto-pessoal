import { EntitySchema } from '@mikro-orm/core';

export interface IBaseEntity {
  id: string;
  createAt: string;
  updateAt: string;
  deleteAt: string | null;
}

export class baseEntity implements IBaseEntity {
  id: string = '';
  createAt: string = '';
  updateAt: string = '';
  deleteAt: string | null = null;
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

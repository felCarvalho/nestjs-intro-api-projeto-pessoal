import { EntitySchema } from '@mikro-orm/core';
import { User } from '../entity/user.entity';
import { UserRepository } from '../repository/user.repository';
import { baseEntity } from '../../shared/core/baseEntity/base.schema';

export const UserSchema = new EntitySchema<User>({
  name: 'user',
  class: User,
  extends: baseEntity,
  tableName: 'users',
  properties: {
    id: { type: 'uuid', primary: true, defaultRaw: 'gen_random_uuid()' },
    name: { type: 'string', length: 150, default: 'nome' },
    updateAt: { type: 'timestamptz', defaultRaw: 'now()' },
    createAt: { type: 'timestamptz', defaultRaw: 'now()' },
    deleteAt: { type: 'timestamptz', nullable: true, default: null },
  },
  repository: () => UserRepository,
});

/*
name: string;
class: Constructor<T>;
extends: string;
tableName: string; // alias for `collection: string`
properties: { [K in keyof T & string]: EntityProperty<T[K]> };
indexes: { properties: string | string[]; name?: string; type?: string }[];
uniques: { properties: string | string[]; name?: string }[];
repository: () => Constructor<EntityRepository<T>>;
hooks: Partial<Record<keyof typeof EventType, ((string & keyof T) | NonNullable<EventSubscriber[keyof EventSubscriber]>)[]>>;
abstract: boolean;
*/

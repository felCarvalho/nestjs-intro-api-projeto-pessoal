import { PersistContract } from '../contracts/contracts.persistence';
import { EntityManager } from '@mikro-orm/postgresql';
import { wrap } from '@mikro-orm/core';

export class basePersistence<T extends object> implements PersistContract<T> {
  constructor(private readonly em: EntityManager) {}

  fromObject(data: T) {
    return wrap(data).toObject() as T;
  }

  async commit() {
    return await this.em.flush();
  }

  persist(data: T) {
    return this.em.persist(data);
  }

  remove(data: T) {
    return this.em.remove(data);
  }
}

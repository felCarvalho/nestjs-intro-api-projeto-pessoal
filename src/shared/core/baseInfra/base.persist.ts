import { PersistContract } from '../contracts/contracts.persistence';
import { EntityManager } from '@mikro-orm/postgresql';

export class basePersistence<T extends object> implements PersistContract<T> {
  constructor(private readonly em: EntityManager) {}

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

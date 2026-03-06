import { EntityManager } from '@mikro-orm/postgresql';
import { TransactionContract } from '../contracts/contracts.transaction';

export class BaseTransaction implements TransactionContract {
  constructor(private readonly em: EntityManager) {}

  async runTransaction(action: () => Promise<unknown>): Promise<unknown> {
    return await this.em.transactional(async () => {
      return await action();
    });
  }
}

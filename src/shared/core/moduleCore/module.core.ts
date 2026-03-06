import { Module } from '@nestjs/common';
import { PersistContract } from '../contracts/contracts.persistence';
import { basePersistence } from '../baseInfra/base.persist';
import { NotificationBuilderContract } from '../contracts/contracts.notification';
import { NotificationBuilder } from '../notification/notification';
import { EntityManager } from '@mikro-orm/postgresql';
import { TransactionContract } from '../contracts/contracts.transaction';
import { BaseTransaction } from '../baseInfra/base.transaction';
import { ResultBuilderContract } from '../contracts/contracts.result';
import { ResultBuilder } from '../result/result';

@Module({
  imports: [],
  providers: [
    {
      provide: PersistContract,
      useFactory: (em: EntityManager) => new basePersistence(em),
      inject: [EntityManager],
    },
    {
      provide: NotificationBuilderContract,
      useFactory: () => {
        return () => new NotificationBuilder();
      },
    },
    {
      provide: ResultBuilderContract,
      useFactory: () => {
        return () => new ResultBuilder<any>();
      },
    },
    {
      provide: TransactionContract,
      useFactory: (em: EntityManager): TransactionContract => {
        return new BaseTransaction(em);
      },
      inject: [EntityManager],
    },
  ],
  exports: [
    PersistContract,
    NotificationBuilderContract,
    ResultBuilderContract,
    TransactionContract,
  ],
})
export class ModuleCore {}

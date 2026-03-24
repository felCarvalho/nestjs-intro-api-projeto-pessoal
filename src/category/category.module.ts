import { Module } from '@nestjs/common';
import { CategoryBuilder } from './categoryBuilder/category.builder';
import { CategoryBuilderContracts } from './contracts/index.contracts';
import { CategoryRepository } from './repository/category.repository';
import { CategoryRepositoryContracts } from './contracts/index.contracts';
import { ModuleCore } from '../shared/core/moduleCore/module.core';
import { ResultBuilderContract } from '../shared/core/contracts/contracts.result';
import { NotificationBuilderContract } from '../shared/core/contracts/contracts.notification';
import { Category } from './entity/category.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { CategoryService } from './service/category.service';

@Module({
  imports: [ModuleCore],
  controllers: [],
  providers: [
    {
      provide: CategoryBuilderContracts,
      useFactory: (
        result: () => ResultBuilderContract<Category>,
        notification: () => NotificationBuilderContract,
        category: Category,
      ) => {
        return () => new CategoryBuilder(result(), notification(), category);
      },
      inject: [ResultBuilderContract, NotificationBuilderContract],
    },
    {
      provide: CategoryRepositoryContracts,
      useFactory: (em: EntityManager) => {
        return new CategoryRepository(em, Category);
      },
      inject: [EntityManager],
    },
    {
      provide: CategoryService,
      useFactory: (
        notification: () => NotificationBuilderContract,
        result: () => ResultBuilderContract<Category>,
        categoryRepo: CategoryRepositoryContracts<Category>,
        categoryBuilder: () => CategoryBuilderContracts<Category>,
      ) => {
        return new CategoryService(
          notification,
          result,
          categoryRepo,
          categoryBuilder,
        );
      },
      inject: [
        NotificationBuilderContract,
        ResultBuilderContract,
        CategoryRepositoryContracts,
        CategoryBuilderContracts,
      ],
    },
  ],
  exports: [CategoryService],
})
export class CategoryModule {}

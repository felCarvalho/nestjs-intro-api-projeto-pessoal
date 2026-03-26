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
import { UsersModule } from '../users/users.module';
import { UserRepositoryContract } from '../users/contracts/index.contract';
import { User } from '../users/entity/user.entity';
import { CategoryController } from './category.controller';
import { PersistContract } from '../shared/core/contracts/contracts.persistence';

@Module({
  imports: [ModuleCore, UsersModule],
  controllers: [CategoryController],
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
        userRepo: UserRepositoryContract<User>,
        persist: PersistContract<Category>,
      ) => {
        return new CategoryService(
          notification,
          result,
          categoryRepo,
          categoryBuilder,
          userRepo,
          persist,
        );
      },
      inject: [
        NotificationBuilderContract,
        ResultBuilderContract,
        CategoryRepositoryContracts,
        CategoryBuilderContracts,
        UserRepositoryContract,
        PersistContract,
      ],
    },
  ],
  exports: [CategoryService],
})
export class CategoryModule {}

import { Module } from '@nestjs/common';
import { CreateCategoryRascunhoController } from './create-category-rascunho.controller';
import { CreateCategoryRascunhoOrquestador } from './create-category-rascunho.orquestrador';
import { CategoryService } from '../../../category/service/category.service';
import { UsersService } from '../../../users/service/users.service';
import { NotificationBuilderContract } from '../../core/contracts/contracts.notification';
import { ResultBuilderContract } from '../../core/contracts/contracts.result';
import { TransactionContract } from '../../core/contracts/contracts.transaction';
import { PersistContract } from '../../core/contracts/contracts.persistence';
import { ModuleCore } from '../../core/moduleCore/module.core';
import { CategoryModule } from '../../../category/category.module';
import { UsersModule } from '../../../users/users.module';
import { AuthModule } from '../../../authentication/auth.module';
import { Category } from '../../../category/entity/category.entity';

@Module({
  imports: [ModuleCore, CategoryModule, UsersModule, AuthModule],
  controllers: [CreateCategoryRascunhoController],
  providers: [
    {
      provide: CreateCategoryRascunhoOrquestador,
      useFactory: (
        categoryService: CategoryService,
        usersService: UsersService,
        notification: () => NotificationBuilderContract,
        result: () => ResultBuilderContract<Category>,
        transaction: TransactionContract,
        persist: PersistContract<Category>,
      ) => {
        return new CreateCategoryRascunhoOrquestador(
          categoryService,
          usersService,
          notification,
          result,
          transaction,
          persist,
        );
      },
      inject: [
        CategoryService,
        UsersService,
        NotificationBuilderContract,
        ResultBuilderContract,
        TransactionContract,
        PersistContract,
      ],
    },
  ],
  exports: [CreateCategoryRascunhoOrquestador],
})
export class CreateCategoryRascunhoModule {}

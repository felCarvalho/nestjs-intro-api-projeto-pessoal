import { Module } from '@nestjs/common';
import { UpdateCategoryTaskOrquestrador } from './update-status-category-task.orquestrador';
import { CategoryService } from '../../../category/service/category.service';
import { TasksService } from '../../../tasks/service/task.service';
import { NotificationBuilderContract } from '../../core/contracts/contracts.notification';
import { ResultBuilderContract } from '../../core/contracts/contracts.result';
import { TransactionContract } from '../../core/contracts/contracts.transaction';
import { ModuleCore } from '../../core/moduleCore/module.core';
import { AuthModule } from '../../../authentication/auth.module';
import { UsersModule } from '../../../users/users.module';
import { UpdateCategoryTaskOrquestradorController } from './update-status-category-task.controller';
import { CategoryModule } from '../../../category/category.module';
import { TasksModule } from '../../../tasks/tasks.module';
import { UsersService } from '../../../users/service/users.service';

@Module({
  imports: [ModuleCore, AuthModule, UsersModule, CategoryModule, TasksModule],
  controllers: [UpdateCategoryTaskOrquestradorController],
  providers: [
    {
      provide: UpdateCategoryTaskOrquestrador,
      useFactory: (
        categoryService: CategoryService,
        tasksService: TasksService,
        userService: UsersService,
        notification: () => NotificationBuilderContract,
        result: () => ResultBuilderContract<any>,
        transaction: TransactionContract,
      ) => {
        return new UpdateCategoryTaskOrquestrador(
          categoryService,
          tasksService,
          userService,
          notification,
          result,
          transaction,
        );
      },
      inject: [
        CategoryService,
        TasksService,
        UsersService,
        NotificationBuilderContract,
        ResultBuilderContract,
        TransactionContract,
      ],
    },
  ],
  exports: [UpdateCategoryTaskOrquestrador],
})
export class UpdateCategoryTaskOrquestradorModule {}

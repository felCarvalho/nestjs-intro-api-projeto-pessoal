import { Module } from '@nestjs/common';
import { GetAllTaskCategoryRascunhoController } from './get-all-task-category-rascunho.controller';
import { GetAllTaskCategoryRascunhoOrquestrador } from './get-all-task-category-rascunho.orquestrador';
import { TasksModule } from '../../../tasks/tasks.module';
import { CategoryModule } from '../../../category/category.module';
import { ModuleCore } from '../../../shared/core/moduleCore/module.core';
import { TasksService } from '../../../tasks/service/task.service';
import { CategoryService } from '../../../category/service/category.service';
import { NotificationBuilderContract } from '../../../shared/core/contracts/contracts.notification';
import { ResultBuilderContract } from '../../../shared/core/contracts/contracts.result';
import { AuthModule } from '../../../authentication/auth.module';

@Module({
  imports: [ModuleCore, TasksModule, CategoryModule, AuthModule],
  controllers: [GetAllTaskCategoryRascunhoController],
  providers: [
    {
      provide: GetAllTaskCategoryRascunhoOrquestrador,
      useFactory: (
        tasks: TasksService,
        categories: CategoryService,
        notification: () => NotificationBuilderContract,
        result: () => ResultBuilderContract<unknown>,
      ) => {
        return new GetAllTaskCategoryRascunhoOrquestrador(
          tasks,
          categories,
          notification,
          result,
        );
      },
      inject: [
        TasksService,
        CategoryService,
        NotificationBuilderContract,
        ResultBuilderContract,
      ],
    },
  ],
  exports: [GetAllTaskCategoryRascunhoOrquestrador],
})
export class GetAllTaskCategoryRascunhoModule {}

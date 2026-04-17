import { Module } from '@nestjs/common';
import { DeleteAllCategoryTaskOrquestrador } from './delete-all-category-task.orquestrador';
import { CategoryService } from '../../../category/service/category.service';
import { TasksService } from '../../../tasks/service/task.service';
import { NotificationBuilderContract } from '../../core/contracts/contracts.notification';
import { ResultBuilderContract } from '../../core/contracts/contracts.result';
import { TransactionContract } from '../../core/contracts/contracts.transaction';
import { ModuleCore } from '../../core/moduleCore/module.core';
import { AuthModule } from '../../../authentication/auth.module';
import { UsersModule } from '../../../users/users.module';
import {} from './delete-all-category-task.controller';
import { CategoryModule } from '../../../category/category.module';
import { TasksModule } from '../../../tasks/tasks.module';
import { UsersService } from '../../../users/service/users.service';
import { DeleteCategoryTaskOrquestradorController } from './delete-all-category-task.controller';
import { Tasks } from '../../../tasks/entity/tasks.entity';

@Module({
  imports: [ModuleCore, AuthModule, UsersModule, CategoryModule, TasksModule],
  controllers: [DeleteCategoryTaskOrquestradorController],
  providers: [
    {
      provide: DeleteAllCategoryTaskOrquestrador,
      useFactory: (
        categoryService: CategoryService,
        tasksService: TasksService,
        usersService: UsersService,
        notificationBuilder: () => NotificationBuilderContract,
        resultBuilder: () => ResultBuilderContract<Tasks>,
        transaction: TransactionContract,
      ) => {
        return new DeleteAllCategoryTaskOrquestrador(
          categoryService,
          tasksService,
          usersService,
          notificationBuilder,
          resultBuilder,
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
  exports: [DeleteAllCategoryTaskOrquestrador],
})
export class DeleteAllCategoryTaskOrquestradorModule {}

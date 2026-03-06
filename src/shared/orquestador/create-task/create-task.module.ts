import { Module } from '@nestjs/common';
import { CreateTaskOrquestrador } from './create-task.orquestrador';
import { CategoryService } from '../../../category/service/category.service';
import { TasksService } from '../../../tasks/service/task.service';
import { NotificationBuilderContract } from '../../core/contracts/contracts.notification';
import { ResultBuilderContract } from '../../core/contracts/contracts.result';
import { TransactionContract } from '../../core/contracts/contracts.transaction';
import { UserRepositoryContract } from '../../../users/contracts/index.contract';
import { User } from '../../../users/entity/user.entity';
import { ModuleCore } from '../../core/moduleCore/module.core';
import { AuthModule } from '../../../authentication/auth.module';
import { UsersModule } from '../../../users/users.module';
import { CreateTaskOrquestradorController } from './create-task.controller';
import { CategoryModule } from '../../../category/category.module';
import { TasksModule } from '../../../tasks/tasks.module';

@Module({
  imports: [ModuleCore, AuthModule, UsersModule, CategoryModule, TasksModule],
  controllers: [CreateTaskOrquestradorController],
  providers: [
    {
      provide: CreateTaskOrquestrador,
      useFactory: (
        categoryService: CategoryService,
        tasksService: TasksService,
        notification: () => NotificationBuilderContract,
        result: () => ResultBuilderContract<any>,
        transaction: TransactionContract,
        userRepo: UserRepositoryContract<User>,
      ) => {
        return new CreateTaskOrquestrador(
          categoryService,
          tasksService,
          notification,
          result,
          transaction,
          userRepo,
        );
      },
      inject: [
        CategoryService,
        TasksService,
        NotificationBuilderContract,
        ResultBuilderContract,
        TransactionContract,
        UserRepositoryContract,
      ],
    },
  ],
  exports: [CreateTaskOrquestrador],
})
export class CreateTaskOrquestradorModule {}

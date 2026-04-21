import { Module } from '@nestjs/common';
import { CreateTaskController } from './create-task.controller';
import { CreateTaskOrquestador } from './create-task.orquestrador';
import { TasksService } from '../../../tasks/service/task.service';
import { UsersService } from '../../../users/service/users.service';
import { CategoryService } from '../../../category/service/category.service';
import { NotificationBuilderContract } from '../../core/contracts/contracts.notification';
import { ResultBuilderContract } from '../../core/contracts/contracts.result';
import { TransactionContract } from '../../core/contracts/contracts.transaction';
import { PersistContract } from '../../core/contracts/contracts.persistence';
import { ModuleCore } from '../../core/moduleCore/module.core';
import { TasksModule } from '../../../tasks/tasks.module';
import { UsersModule } from '../../../users/users.module';
import { CategoryModule } from '../../../category/category.module';
import { AuthModule } from '../../../authentication/auth.module';
import { Tasks } from '../../../tasks/entity/tasks.entity';

@Module({
  imports: [ModuleCore, TasksModule, UsersModule, CategoryModule, AuthModule],
  controllers: [CreateTaskController],
  providers: [
    {
      provide: CreateTaskOrquestador,
      useFactory: (
        tasksService: TasksService,
        usersService: UsersService,
        categoryService: CategoryService,
        notification: () => NotificationBuilderContract,
        result: () => ResultBuilderContract<Tasks>,
        transaction: TransactionContract,
        persist: PersistContract<Tasks>,
      ) => {
        return new CreateTaskOrquestador(
          tasksService,
          usersService,
          categoryService,
          notification,
          result,
          transaction,
          persist,
        );
      },
      inject: [
        TasksService,
        UsersService,
        CategoryService,
        NotificationBuilderContract,
        ResultBuilderContract,
        TransactionContract,
        PersistContract,
      ],
    },
  ],
  exports: [CreateTaskOrquestador],
})
export class CreateTaskOrquestradorModule {}

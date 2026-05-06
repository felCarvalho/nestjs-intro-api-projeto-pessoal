import { Module } from '@nestjs/common';
import { CreateRotinaOrquestrador } from './create-rotina.orquestrador';
import { CategoryService } from '../../../category/service/category.service';
import { TasksService } from '../../../tasks/service/task.service';
import { UsersService } from '../../../users/service/users.service';
import { NotificationBuilderContract } from '../../core/contracts/contracts.notification';
import { ResultBuilderContract } from '../../core/contracts/contracts.result';
import { TransactionContract } from '../../core/contracts/contracts.transaction';
import { ModuleCore } from '../../core/moduleCore/module.core';
import { AuthModule } from '../../../authentication/auth.module';
import { UsersModule } from '../../../users/users.module';
import { CreateRotinaOrquestradorController } from './create-rotina.controller';
import { CategoryModule } from '../../../category/category.module';
import { TasksModule } from '../../../tasks/tasks.module';

@Module({
  imports: [ModuleCore, AuthModule, UsersModule, CategoryModule, TasksModule],
  controllers: [CreateRotinaOrquestradorController],
  providers: [
    {
      provide: CreateRotinaOrquestrador,
      useFactory: (
        categoryService: CategoryService,
        tasksService: TasksService,
        usersService: UsersService,
        notification: () => NotificationBuilderContract,
        result: () => ResultBuilderContract<any>,
        transaction: TransactionContract,
      ) => {
        return new CreateRotinaOrquestrador(
          categoryService,
          tasksService,
          usersService,
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
  exports: [CreateRotinaOrquestrador],
})
export class CreateRotinaOrquestradorModule {}

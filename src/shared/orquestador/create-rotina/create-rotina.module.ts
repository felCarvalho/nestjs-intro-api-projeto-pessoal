import { Module } from '@nestjs/common';
import { CreateRotinaOrquestrador } from './create-rotina.orquestrador';
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
        notification: () => NotificationBuilderContract,
        result: () => ResultBuilderContract<any>,
        transaction: TransactionContract,
        userRepo: UserRepositoryContract<User>,
      ) => {
        return new CreateRotinaOrquestrador(
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
  exports: [CreateRotinaOrquestrador],
})
export class CreateRotinaOrquestradorModule {}

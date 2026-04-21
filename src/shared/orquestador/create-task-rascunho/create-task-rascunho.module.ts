import { Module } from '@nestjs/common';
import { CreateTaskRascunhoController } from './create-task-rascunho.controller';
import { CreateTaskRascunhoOrquestador } from './create-task-rascunho.orquestrador';
import { TasksService } from '../../../tasks/service/task.service';
import { UsersService } from '../../../users/service/users.service';
import { NotificationBuilderContract } from '../../core/contracts/contracts.notification';
import { ResultBuilderContract } from '../../core/contracts/contracts.result';
import { TransactionContract } from '../../core/contracts/contracts.transaction';
import { PersistContract } from '../../core/contracts/contracts.persistence';
import { ModuleCore } from '../../core/moduleCore/module.core';
import { TasksModule } from '../../../tasks/tasks.module';
import { UsersModule } from '../../../users/users.module';
import { AuthModule } from '../../../authentication/auth.module';
import { Tasks } from '../../../tasks/entity/tasks.entity';

@Module({
  imports: [ModuleCore, TasksModule, UsersModule, AuthModule],
  controllers: [CreateTaskRascunhoController],
  providers: [
    {
      provide: CreateTaskRascunhoOrquestador,
      useFactory: (
        tasksService: TasksService,
        usersService: UsersService,
        notification: () => NotificationBuilderContract,
        result: () => ResultBuilderContract<Tasks>,
        transaction: TransactionContract,
        persist: PersistContract<Tasks>,
      ) => {
        return new CreateTaskRascunhoOrquestador(
          tasksService,
          usersService,
          notification,
          result,
          transaction,
          persist,
        );
      },
      inject: [
        TasksService,
        UsersService,
        NotificationBuilderContract,
        ResultBuilderContract,
        TransactionContract,
        PersistContract,
      ],
    },
  ],
  exports: [CreateTaskRascunhoOrquestador],
})
export class CreateTaskRascunhoModule {}

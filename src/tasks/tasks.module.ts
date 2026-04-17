import { EntityManager } from '@mikro-orm/postgresql';
import { Module } from '@nestjs/common';
import { CategoryModule } from '../category/category.module';
import { NotificationBuilderContract } from '../shared/core/contracts/contracts.notification';
import { PersistContract } from '../shared/core/contracts/contracts.persistence';
import { ResultBuilderContract } from '../shared/core/contracts/contracts.result';
import { ModuleCore } from '../shared/core/moduleCore/module.core';
import { UsersModule } from '../users/users.module';
import {
  TaskBuilderContract,
  TaskRepositoryContract,
} from './contracts/index.contracts';
import { Tasks } from './entity/tasks.entity';
import { TasksRepository } from './repository/task.repository';
import { TasksService } from './service/task.service';
import { TasksBuilder } from './tasksBuilder/tasks.builder';
import { AuthModule } from '../authentication/auth.module';
import { TasksController } from './tasks.controller';
import { UserRepositoryContract } from 'src/users/contracts/index.contract';
import { User } from '../users/entity/user.entity';

@Module({
  imports: [ModuleCore, CategoryModule, UsersModule, AuthModule],
  controllers: [TasksController],
  providers: [
    {
      provide: TaskBuilderContract,
      useFactory: (
        result: () => ResultBuilderContract<Tasks | Tasks[]>,
        notification: () => NotificationBuilderContract,
        tasks: Tasks,
      ) => {
        return () => new TasksBuilder(result(), notification(), tasks);
      },
      inject: [ResultBuilderContract, NotificationBuilderContract],
    },
    {
      provide: TaskRepositoryContract,
      useFactory: (em: EntityManager) => {
        return new TasksRepository(em, Tasks);
      },
      inject: [EntityManager],
    },
    {
      provide: TasksService,
      useFactory: (
        persist: PersistContract<Tasks>,
        notification: () => NotificationBuilderContract,
        result: () => ResultBuilderContract<any>,
        tasksRepo: TaskRepositoryContract<Tasks>,
        taskBuilder: () => TaskBuilderContract<Tasks>,
        userRepo: UserRepositoryContract<User>,
      ) => {
        return new TasksService(
          persist,
          notification,
          result,
          tasksRepo,
          taskBuilder,
          userRepo,
        );
      },
      inject: [
        PersistContract,
        NotificationBuilderContract,
        ResultBuilderContract,
        TaskRepositoryContract,
        TaskBuilderContract,
        UserRepositoryContract,
      ],
    },
  ],
  exports: [TasksService],
})
export class TasksModule {}

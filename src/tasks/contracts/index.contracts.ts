import { NotificationBuilderContract } from '../../shared/core/contracts/contracts.notification';
import {
  ResultBuilderContract,
  ResultContract,
} from '../../shared/core/contracts/contracts.result';
import { ICategory, IUser } from '../../shared/core/types/types';
import { Tasks } from '../entity/tasks.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { Category } from '../../category/entity/category.entity';
import { User } from '../../users/entity/user.entity';
import { UpdateTaskDto } from '../dto/update-task.dto';

export abstract class TaskRepositoryContract<T> {
  abstract findById: (id: string) => Promise<T | null>;
  abstract findAllBy: (id: string) => Promise<T[]>;
  abstract findTitle: (name: string) => Promise<T | null>;
  abstract findAllTasksUser: (id: string) => Promise<T[]>;
  abstract createTask(task: Tasks): void;
}

export abstract class TaskBuilderContract<T> {
  abstract setTitle(title: string): this;
  abstract setDescription(description: string): this;
  abstract setCategory(category: ICategory): this;
  abstract setCompleted(completed: 'Incompleta' | 'Concluida'): this;
  abstract setCreateDate(date: string): this;
  abstract setUser(user: IUser): this;
  abstract setUpdateDate(date: string): this;
  abstract setDeleteDate(date: string): this;
  abstract generateId(): this;
  abstract build(): ResultContract<T>;
}

export abstract class TaskServiceContract {
  abstract notificationBuilder(): NotificationBuilderContract;
  abstract resultBuilder(): ResultBuilderContract<Tasks | Tasks[]>;
  abstract verifyMaxLength(data: string, maxLength: number): boolean;
  abstract verifyMinLength(data: string, minLength: number): boolean;
  abstract createTask(
    task: CreateTaskDto,
    category: Category,
    user: User,
  ): Promise<void>;
  abstract updateTasksTitle(
    task: UpdateTaskDto,
  ): Promise<ResultContract<Tasks | Tasks[]>>;
  abstract updateTasksStatus(
    task: UpdateTaskDto,
  ): Promise<ResultContract<Tasks | Tasks[]>>;
  abstract updateTasksDescription(
    task: UpdateTaskDto,
  ): Promise<ResultContract<Tasks | Tasks[]>>;
  abstract findTasks(
    idUser: string,
    idTasks: string,
  ): Promise<ResultContract<Tasks | Tasks[]>>;
  abstract findAllTasks(
    idUser: string,
  ): Promise<ResultContract<Tasks | Tasks[]>>;
}

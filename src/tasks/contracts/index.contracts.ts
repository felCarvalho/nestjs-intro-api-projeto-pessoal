import { ResultContract } from '../../shared/core/contracts/contracts.result';
import { User } from '../../users/entity/user.entity';
import { Tasks } from '../entity/tasks.entity';
import { Category } from '../../category/entity/category.entity';

export abstract class TaskRepositoryContract<T> {
  abstract findById: (id: string, iduser: string) => Promise<T | null>;
  abstract findByIdDeleted: (id: string, idUser: string) => Promise<T | null>;
  abstract findAllBy: (id: string) => Promise<T[]>;
  abstract findByIdRascunhos: (id: string, idUser: string) => Promise<T | null>;
  abstract findTitle: (name: string, idUser: string) => Promise<T | null>;
  abstract findAllTasksUser: (id: string) => Promise<T[]>;
  abstract createTask(task: Tasks): void;
  abstract searchTask(query: string, idUser: string): Promise<T[]>;
  abstract findAllRascunhos: (idUser: string) => Promise<T[]>;
  abstract allUpdateTasks(
    idUser: string,
    idCategory: string,
    completed: string,
  ): Promise<number>;
  abstract deleteAllTasks(idCategory: string, idUser: string): Promise<number>;
  abstract findTodayTasks(idUser: string, start: Date, end: Date): Promise<T[]>;
  abstract findWeekTasks(idUser: string, start: Date, end: Date): Promise<T[]>;
  abstract findMonthTasks(idUser: string, start: Date, end: Date): Promise<T[]>;
  abstract findAllPeriodTasks(idUser: string): Promise<T[]>;
}

export abstract class TaskBuilderContract<T> {
  abstract setTitle(title: string): this;
  abstract setDescription(description: string): this;
  abstract setCategory(category: Category | null): this;
  abstract setCompleted(completed: 'Incompleta' | 'Concluída'): this;
  abstract setCreateDate(date: Date): this;
  abstract setUser(user: User): this;
  abstract setUpdateDate(date: Date): this;
  abstract setDeleteDate(date: Date | null): this;
  abstract setStatus(status: 'Ativa' | 'Inativa'): this;
  abstract generateId(): this;
  abstract build(): ResultContract<T>;
}

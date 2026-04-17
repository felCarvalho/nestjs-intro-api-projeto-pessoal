import { EntityRepository } from '@mikro-orm/postgresql';
import { Tasks } from '../entity/tasks.entity';
import { TaskRepositoryContract } from '../contracts/index.contracts';

export class TasksRepository
  extends EntityRepository<Tasks>
  implements TaskRepositoryContract<Tasks>
{
  async findById(id: string) {
    return await this.findOne(
      { id },
      {
        populate: ['category', 'user'],
        filters: {
          taskActive: false,
          isCategory: false,
        },
      },
    );
  }

  async allUpdateTasks(idUser: string, idCategory: string, completed: string) {
    return await this.nativeUpdate(
      {
        user: { id: idUser },
        category: { id: idCategory },
      },
      {
        completed: completed,
      },
    );
  }

  async findByIdRascunhos(id: string) {
    return await this.findOne(
      { id },
      {
        populate: ['category', 'user'],
        filters: {
          taskActive: false,
          isDeleted: false,
          isCategory: false,
        },
      },
    );
  }

  async findByIdDeleted(id: string) {
    return await this.findOne(
      { id },
      {
        populate: ['category', 'user'],
        filters: {
          taskDeleted: true,
          taskActive: false,
          isCategory: false,
        },
      },
    );
  }

  async findAllBy(id: string) {
    return await this.find(
      { user: id },
      {
        populate: ['category'],
      },
    );
  }

  async searchTask(query: string, idUser: string) {
    return await this.find(
      {
        user: idUser,
        title: { $ilike: `%${query}%` },
      },
      {
        populate: ['category'],
      },
    );
  }

  async findTitle(name: string) {
    return await this.findOne(
      { title: name },
      {
        filters: { isCategory: false },
      },
    );
  }

  async findAllTasksUser(id: string) {
    return await this.findAll({
      where: { user: id },
      populate: ['category'],
    });
  }

  async findAllRascunhos(idUser: string) {
    return await this.find(
      {
        user: idUser,
        status: 'Inativa',
      },
      {
        populate: ['category'],
        filters: {
          isCategory: false,
        },
      },
    );
  }

  async deleteAllTasks(idCategory: string, idUser: string) {
    return await this.nativeUpdate(
      {
        category: idCategory,
        user: idUser,
      },
      {
        deleteAt: new Date().toISOString(),
      },
    );
  }

  createTask(task: Tasks) {
    this.create(task);
  }
}

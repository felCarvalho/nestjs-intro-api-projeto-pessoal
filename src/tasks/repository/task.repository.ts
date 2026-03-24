import { EntityRepository } from '@mikro-orm/postgresql';
import { Tasks } from '../entity/tasks.entity';
import { TaskRepositoryContract } from '../contracts/index.contracts';
import { wrap } from '@mikro-orm/core';

export class TasksRepository
  extends EntityRepository<Tasks>
  implements TaskRepositoryContract<Tasks>
{
  async findById(id: string) {
    return await this.findOne(
      { id },
      {
        populate: ['category', 'user'],
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
        },
      },
    );
  }

  async findAllBy(id: string) {
    const tasks = await this.find(
      { user: id },
      {
        populate: ['category'],
      },
    );

    return tasks;
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
    return this.findOne({ title: name });
  }

  async findAllTasksUser(id: string) {
    return this.findAll({
      where: { user: id },
      populate: ['category'],
    });
  }

  createTask(task: Tasks) {
    this.create(task);
  }
}

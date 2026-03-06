import { EntityRepository } from '@mikro-orm/postgresql';
import { Tasks } from '../entity/tasks.entity';
import { TaskRepositoryContract } from '../contracts/index.contracts';

export class TasksRepository
  extends EntityRepository<Tasks>
  implements TaskRepositoryContract<Tasks>
{
  async findById(id: string) {
    return this.findOne({ id });
  }

  async findAllBy(id: string) {
    return this.findAll({ where: id });
  }

  async findTitle(name: string) {
    return this.findOne({ title: name });
  }

  async findAllTasksUser(id: string) {
    return this.findAll({ where: { user: id } });
  }

  createTask(task: Tasks) {
    this.create(task);
  }
}

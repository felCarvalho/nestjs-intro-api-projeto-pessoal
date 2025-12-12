import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from '../tasks/dto/create-task.dto';
import { UpdateTaskDto } from '../tasks/dto/update-task.dto';

export class TaskRepository {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  createTasks(tasks: CreateTaskDto) {
    const createTasks = this.taskRepository.create(tasks);

    return this.taskRepository.save(createTasks);
  }

  async findAllTasks(idUser: number) {
    const findTasks = await this.taskRepository.find({
      where: { idUser: idUser },
    });

    return findTasks ? findTasks : null;
  }

  async findTasksByPublicId(publicId: string) {
    const findTasks = await this.taskRepository.findOneBy({ publicId });

    return findTasks ? findTasks : null;
  }

  async findTasksById(id: number) {
    const findTasks = await this.taskRepository.findOneBy({ id });

    return findTasks ? findTasks : null;
  }

  async updateTask(publicId: string, task: UpdateTaskDto) {
    const updateTask = await this.taskRepository.update(publicId, task);

    return updateTask ? updateTask : null;
  }

  async deleteTask(id: number) {
    const findDeleteTask = await this.taskRepository.delete(id);

    return findDeleteTask?.affected ? findDeleteTask : null;
  }

  async renameTasks(publicId: string, renameTasks: UpdateTaskDto) {
    const renameTasksUpdate = await this.taskRepository.update(
      publicId,
      renameTasks,
    );

    return renameTasksUpdate?.affected ? renameTasksUpdate : null;
  }

  async restaurarTasks(id: number) {
    const lixeiraTasks = await this.taskRepository.restore(id);

    return lixeiraTasks ? lixeiraTasks : null;
  }
}

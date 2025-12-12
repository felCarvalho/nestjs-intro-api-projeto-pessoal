import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(private taskRepository: TaskRepository) {}

  async create(createTaskDto: CreateTaskDto) {
    if (!createTaskDto.title || !createTaskDto.description) {
      throw new Error('Ops, digite um titulo ou uma descrição para sua tarefa');
    }

    return await this.taskRepository.createTasks(createTaskDto);
  }

  async findAll(idUser: number) {
    const tasks = await this.taskRepository.findAllTasks(idUser);

    if (!tasks) {
      throw new Error('Ops, erro ao buscar suas tarefas');
    }

    if (!tasks?.length) {
      throw new Error('Ops, você não possui tarefas cadastradas');
    }

    return tasks;
  }

  async findOne(publicId: string) {
    const task = await this.taskRepository.findTasksByPublicId(publicId);

    if (!task) {
      throw new Error('Ops, tarefa não encontrada');
    }

    return task;
  }

  async update(publicId: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskRepository.updateTask(publicId, updateTaskDto);

    if (!task) {
      throw new Error('Ops, tarefa não encontrada para atualizar');
    }

    return await this.taskRepository.findTasksByPublicId(publicId);
  }

  async delete(id: number) {
    const task = await this.taskRepository.deleteTask(id);

    if (!task) {
      throw new Error('Ops, tarefa não encontrada para deletar');
    }

    return await this.taskRepository.findTasksById(id);
  }

  async rename(publicId: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskRepository.updateTask(publicId, updateTaskDto);

    if (!task) {
      throw new Error('Ops, tarefa não encontrada para renomear');
    }

    return await this.taskRepository.findTasksByPublicId(publicId);
  }

  async restore(id: number) {
    const task = await this.taskRepository.restaurarTasks(id);

    if (!task) {
      throw new Error('Ops, tarefa não encontrada para restaurar');
    }

    return await this.taskRepository.findTasksById(id);
  }
}

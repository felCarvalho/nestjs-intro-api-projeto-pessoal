import { NotificationBuilderContract } from '../../shared/core/contracts/contracts.notification';
import { ResultBuilderContract } from '../../shared/core/contracts/contracts.result';
import {
  TaskBuilderContract,
  TaskRepositoryContract,
} from '../contracts/index.contracts';
import { Tasks } from '../entity/tasks.entity';
import { NotificationException } from '../../shared/core/@custom-decorators/exception-custom/exception';
import { PersistContract } from '../../shared/core/contracts/contracts.persistence';
import { User } from '../../users/entity/user.entity';
import { Category } from 'src/category/entity/category.entity';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { CreateTaskDto } from '../dto/create-task.dto';

export class TasksService {
  constructor(
    private readonly persist: PersistContract<Tasks>,
    private readonly notification: () => NotificationBuilderContract,
    private readonly result: () => ResultBuilderContract<Tasks | Tasks[]>,
    private readonly taskRepo: TaskRepositoryContract<Tasks>,
    private readonly taskBuilder: () => TaskBuilderContract<Tasks>,
  ) {}

  verifyMaxLength(data: string, maxLength: number) {
    if (data.length > maxLength) {
      return true;
    }

    return false;
  }

  verifyMinLength(data: string, minLength: number) {
    if (data.length < minLength) {
      return true;
    }

    return false;
  }

  async creataskCore(task: CreateTaskDto, user: User) {
    const notification = this.notification();
    const result = this.result();

    if (!user.id) {
      notification.setType('ERROR').setMessage('Ops! Usuário inválido').add();
    }

    if (!task.titleTask) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Titulo da sua rotina está inválido')
        .add();
    }

    if (notification.verifyErrors()) {
      return result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();
    }

    if (!task.descriptionTask) {
      notification
        .setType('INFO')
        .setMessage('Ops! Descrição da sua rotina está inválida')
        .add();
    }

    const findTask = await this.taskRepo.findTitle(task.titleTask);

    if (findTask) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Essa rotina já existe')
        .add();

      const data = result
        .setCode(409)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(data);
    }

    if (this.verifyMaxLength(task.titleTask, 255)) {
      notification
        .setType('WARNING')
        .setMessage('Ops! Titulo da sua rotina está muito longo')
        .add();
    }

    if (this.verifyMinLength(task.titleTask, 5)) {
      notification
        .setType('WARNING')
        .setMessage('Ops! Sua descrição está muito longa')
        .add();
    }

    if (this.verifyMaxLength(task.descriptionTask, 400)) {
      notification
        .setType('WARNING')
        .setMessage('Ops! Sua descrição está muito longa')
        .add();
    }

    if (notification.verifyWarnings()) {
      return result
        .setCode(404)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();
    }

    return result.setSuccess(true).build();
  }

  async createRotina(task: CreateTaskDto, category: Category, user: User) {
    const notification = this.notification();
    const result = this.result();
    const verifyTasksCreated = await this.creataskCore(task, user);

    if (!verifyTasksCreated?.success) {
      throw new NotificationException(verifyTasksCreated);
    }

    if (!category.id) {
      notification
        .setType('ERROR')
        .setMessage('Ops! id de categoria inválido')
        .add();

      const data = result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(data);
    }

    const date = new Date().toISOString();

    const taskBuilder = this.taskBuilder();
    taskBuilder.generateId();
    taskBuilder.setTitle(task.titleTask);
    taskBuilder.setDescription(task.descriptionTask);
    taskBuilder.setCategory(category);
    taskBuilder.setUser(user);
    taskBuilder.setCreateDate(date);
    taskBuilder.setUpdateDate(date);
    taskBuilder.setCompleted('Incompleta');
    const taskBuild = taskBuilder.build();

    if (!taskBuild.success) {
      notification
        .setType('ERROR')
        .setMessage('Ops, tivemos um problema ao criar sua rotina')
        .add();

      const data = result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(data);
    }

    this.taskRepo.createTask(taskBuild.data);
    return taskBuild.data;
  }

  async createTask(task: CreateTaskDto, user: User) {
    const notification = this.notification();
    const result = this.result();

    const verifyTasksCreated = await this.creataskCore(task, user);
    if (!verifyTasksCreated.success) {
      throw new NotificationException(verifyTasksCreated);
    }

    const date = new Date().toISOString();

    const taskBuilder = this.taskBuilder();
    taskBuilder.generateId();
    taskBuilder.setTitle(task.titleTask);
    taskBuilder.setDescription(task.descriptionTask);
    taskBuilder.setUser(user);
    taskBuilder.setCreateDate(date);
    taskBuilder.setUpdateDate(date);
    taskBuilder.setCompleted('Incompleta');
    const taskBuild = taskBuilder.build();

    if (!taskBuild.success) {
      notification
        .setType('ERROR')
        .setMessage('Ops, Não conseguimos criar sua tarefa')
        .add();

      const data = result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(data);
    }

    notification.setType('INFO').setMessage('Opa, sua tarefa foi criada').add();

    const data = result
      .setCode(200)
      .setData(taskBuild.data)
      .setNotification(notification.build())
      .setSuccess(true)
      .build();

    return data;
  }

  async updateTasksTitle(task: UpdateTaskDto) {
    const notification = this.notification();
    const result = this.result();

    if (!task.idUser) {
      notification
        .setType('ERROR')
        .setMessage('Ops! id de usuário inválido')
        .add();
    }

    if (!task.idTask) {
      notification
        .setType('ERROR')
        .setMessage('Ops! id de tarefa inválido')
        .add();
    }

    if (!task.titleTask) {
      notification
        .setType('ERROR')
        .setMessage('Ops! título inválido para atualizar')
        .add();
    }

    if (notification.verifyErrors()) {
      const resultException = result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(resultException);
    }

    const findTasks = await this.taskRepo.findById(task.idTask);

    if (!findTasks) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Tarefa não encontrada')
        .add();
    }

    if (findTasks && findTasks.user.id !== task.idUser) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Você não pode atualizar essa rotina')
        .add();
    }

    if (findTasks && findTasks.user.id === task.idUser) {
      notification
        .setType('INFO')
        .setMessage('Opa! Sua rotina renomeada')
        .add();

      //aqui sendo atualizada a propriedade title da rotina do user
      if (findTasks.title && task.titleTask) findTasks.title = task?.titleTask;

      this.persist.persist(findTasks);

      try {
        await this.persist.commit();

        notification
          .setType('INFO')
          .setMessage('Opa! Sua rotina renomeada')
          .add();

        const data = result
          .setCode(200)
          .setData(this.persist.fromObject(findTasks))
          .setNotification(notification.build())
          .setSuccess(true)
          .build();

        return data.data;
      } catch (e) {
        notification
          .setType('ERROR')
          .setMessage(
            'Ops! Tivemos um erro interno ao salvar o novo titulo para sua rotina',
          )
          .add();

        result
          .setCode(500)
          .setNotification(notification.build())
          .setSuccess(false);
        const resultException = result.build();

        throw new NotificationException(resultException);
      }
    }

    notification
      .setType('ERROR')
      .setMessage('Ops! Não conseguimos atualizar sua rotina')
      .add();

    result.setCode(500).setNotification(notification.build()).setSuccess(false);
    const resultException = result.build();

    throw new NotificationException(resultException);
  }

  async updateDeletedTask({
    idTask,
    idUser,
  }: {
    idTask: string;
    idUser: string;
  }) {
    const notification = this.notification();
    const result = this.result();

    if (!idTask || !idUser) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Não conseguimos deletar sua rotina')
        .add();

      result.setNotification(notification.build()).setSuccess(false);
      const resultException = result.build();

      throw new NotificationException(resultException);
    }

    const findTasks = await this.taskRepo.findById(idTask);

    if (!findTasks) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Não conseguimos encontrar sua rotina')
        .add();

      result.setNotification(notification.build()).setSuccess(false);
      const resultException = result.build();

      throw new NotificationException(resultException);
    }

    if (findTasks && findTasks?.user.id !== idUser) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Você não tem permissão para deletar essa rotina')
        .add();

      result.setNotification(notification.build()).setSuccess(false);
      const resultException = result.build();

      throw new NotificationException(resultException);
    }

    findTasks.deleteAt = new Date().toISOString();
    this.persist.persist(findTasks);

    try {
      await this.persist.commit();

      notification
        .setType('ERROR')
        .setMessage('Opa, Sua rotina foi deletada')
        .add();

      const data = result
        .setCode(200)
        .setData(this.persist.fromObject(findTasks))
        .setNotification(notification.build())
        .build();

      return data;
    } catch (e) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Ocorreu um erro ao deletar sua rotina')
        .add();

      result.setNotification(notification.build()).setSuccess(false);
      const resultException = result.build();

      throw new NotificationException(resultException);
    }
  }

  async updateTasksStatus(task: UpdateTaskDto) {
    const notification = this.notification();
    const result = this.result();

    if (!task.idTask) {
      notification
        .setType('ERROR')
        .setMessage('Ops! id de rotina inválido')
        .add();
    }

    if (!task.idUser) {
      notification
        .setType('ERROR')
        .setMessage('Ops! id de usuário inválido')
        .add();
    }

    if (task.completed !== 'Concluída' && task.completed !== 'Incompleta') {
      notification
        .setType('ERROR')
        .setMessage('Ops! Seu status está inválido para atualização')
        .add();
    }

    if (notification.verifyErrors()) {
      result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false);
      const resultException = result.build();

      throw new NotificationException(resultException);
    }

    const findTasks = await this.taskRepo.findById(task.idTask);

    if (!findTasks) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Sua rotina não foi encontrada')
        .add();
    }

    //.log(findTasks?.user, 'ops, idUser', task.idUser);

    if (findTasks && findTasks.user.id !== task.idUser) {
      notification
        .setType('WARNING')
        .setMessage('Ops! Essa rotina só pode ser modificada pelo seu usuário')
        .add();
    }

    if (findTasks && findTasks.user.id === task.idUser) {
      notification
        .setType('INFO')
        .setMessage('Opa! Sua status da rotina foi atualizada')
        .add();

      if (findTasks.completed && task.completed) {
        findTasks.completed = task.completed;

        try {
          await this.persist.commit();

          notification
            .setType('INFO')
            .setMessage('Opa! O status da sua rotina foi atualizado')
            .add();

          const data = result
            .setCode(200)
            .setData(this.persist.fromObject(findTasks))
            .setNotification(notification.build())
            .setSuccess(true)
            .build();

          return data.data;
        } catch (e) {
          notification
            .setType('ERROR')
            .setMessage(
              'Ops! Tivemos um erro interno ao salvar o novo titulo para sua rotina',
            )
            .add();

          result
            .setCode(500)
            .setNotification(notification.build())
            .setSuccess(false);
          const resultException = result.build();

          throw new NotificationException(resultException);
        }
      }
    }

    notification
      .setType('ERROR')
      .setMessage('Ops! Não conseguimos atualizar sua rotina')
      .add();

    result.setCode(500).setNotification(notification.build()).setSuccess(false);
    const resultException = result.build();

    throw new NotificationException(resultException);
  }

  async updateTasksDescription(task: UpdateTaskDto) {
    const notification = this.notification();
    const result = this.result();

    if (!task.idUser) {
      notification
        .setType('ERROR')
        .setMessage('Ops! id de usuário é inválido')
        .add();
    }

    if (!task.idTask) {
      notification
        .setType('ERROR')
        .setMessage('Ops! id dá sua rotina é inválido')
        .add();
    }

    if (!task.descriptionTask) {
      notification
        .setType('ERROR')
        .setMessage('Ops! descrição é inválida')
        .add();
    }

    if (notification.verifyErrors()) {
      result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false);
      const resultException = result.build();

      throw new NotificationException(resultException);
    }

    const findTasks = await this.taskRepo.findById(task.idTask);

    if (!findTasks) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Não encontramos suas tarefas')
        .add();
    }

    if (findTasks && findTasks?.user.id !== task.idUser) {
      notification
        .setType('WARNING')
        .setMessage('Ops! Essa rotina só pode ser modificada pelo seu usuário')
        .add();
    }

    if (findTasks && findTasks?.user.id === task.idUser) {
      notification
        .setType('INFO')
        .setMessage('Opa! Sua descrição foi atualizada')
        .add();

      if (findTasks.description && task.descriptionTask) {
        findTasks.description = task.descriptionTask;

        try {
          await this.persist.commit();

          notification
            .setType('INFO')
            .setMessage('Opa! O status da sua rotina foi atualizado')
            .add();

          const data = result
            .setCode(200)
            .setData(this.persist.fromObject(findTasks))
            .setNotification(notification.build())
            .setSuccess(true)
            .build();

          return data.data;
        } catch (e) {
          notification
            .setType('ERROR')
            .setMessage(
              'Ops! Tivemos um erro interno ao salvar o novo titulo para sua rotina',
            )
            .add();

          result
            .setCode(500)
            .setNotification(notification.build())
            .setSuccess(false);
          const resultException = result.build();

          throw new NotificationException(resultException);
        }
      }
    }

    notification
      .setType('ERROR')
      .setMessage('Ops! Não conseguimos atualizar a sua rotina')
      .add();

    result.setCode(500).setNotification(notification.build()).setSuccess(false);
    const resultException = result.build();

    throw new NotificationException(resultException);
  }

  async findTasks(idUser: string, idTasks: string) {
    const notification = this.notification();
    const result = this.result();

    if (!idUser) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Id do usuário inválido')
        .add();
    }

    if (!idTasks) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Id da tarefa inválido')
        .add();
    }

    const findTasks = await this.taskRepo.findById(idTasks);

    if (findTasks && findTasks?.user.id !== idUser) {
      notification
        .setType('ERROR')
        .setMessage('Ops! não encontramos essa rotina com seu usuário')
        .add();
    }

    if (notification.verifyErrors() || notification.verifyWarnings()) {
      const resultException = result
        .setCode(404)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(resultException);
    }

    if (findTasks) {
      const data = result
        .setCode(200)
        .setData(findTasks)
        .setSuccess(true)
        .build();

      return data;
    }

    notification.setType('ERROR').setMessage('Ops! Dados inválidos').add();

    return result
      .setCode(500)
      .setNotification(notification.build())
      .setSuccess(false)
      .build();
  }

  async findAllTasks(idUser: string) {
    const notification = this.notification();
    const result = this.result();

    if (!idUser) {
      notification
        .setType('ERROR')
        .setMessage('Ops! id de usuário inválido')
        .add();
    }

    const findTasks = await this.taskRepo.findAllTasksUser(idUser);

    if (!findTasks) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Não conseguimos encontrar nada')
        .add();
    }

    if (notification.verifyErrors()) {
      const resultException = result
        .setCode(404)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(resultException);
    }

    if (findTasks) {
      const data = result
        .setCode(200)
        .setData(findTasks)
        .setSuccess(true)
        .build();

      return data;
    }

    notification.setType('ERROR').setMessage('Ops! Dados inválidos').add();

    return result
      .setCode(500)
      .setNotification(notification.build())
      .setSuccess(false)
      .build();
  }

  async taskSearch({ idUser, search }: { idUser: string; search: string }) {
    const notification = this.notification();
    const result = this.result();

    if (!idUser) {
      notification.setType('ERROR').setMessage('Ops! usuário inválido').add();
    }

    if (!search) {
      notification
        .setType('ERROR')
        .setMessage('Ops! não encontramos nenhuma rotina')
        .add();
    }

    if (notification.verifyErrors()) {
      const resultException = result
        .setCode(404)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(resultException);
    }

    const searchData = await this.taskRepo.searchTask(search, idUser);

    const data = result
      .setCode(200)
      .setSuccess(true)
      .setData(searchData)
      .build();

    return data;
  }

  async taskUpdate(task: UpdateTaskDto) {
    if (task.titleTask && task.idTask) {
      await this.updateTasksTitle(task);
    }

    if (task.completed && task.idTask) {
      await this.updateTasksStatus(task);
    }

    if (task.descriptionTask && task.idTask) {
      await this.updateTasksDescription(task);
    }
  }
}

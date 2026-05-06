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
import { Category } from '../../category/entity/category.entity';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { CreateTaskDto } from '../dto/create-task.dto';
import {
  taskSchemaValidator,
  updateTaskSchemaValidator,
  deleteTaskSchemaValidator,
  findTaskSchemaValidator,
  searchTaskSchemaValidator,
  CreateTaskProps,
  UpdateTaskProps,
  DeleteTaskProps,
  FindTaskProps,
  SearchTaskProps,
} from '../../shared/core/strategy';
import { isRequired, isInEnum, matches } from '../../shared/core/validators';

export class TasksService {
  constructor(
    private readonly persist: PersistContract<Tasks>,
    private readonly notification: () => NotificationBuilderContract,
    private readonly result: () => ResultBuilderContract<Tasks | Tasks[]>,
    private readonly taskRepo: TaskRepositoryContract<Tasks>,
    private readonly taskBuilder: () => TaskBuilderContract<Tasks>,
  ) {}

  private async createTaskCore(task: CreateTaskDto, user: User) {
    const result = this.result();
    const notification = this.notification();

    if (!user.id) {
      notification
        .setType('ERROR')
        .setKey('idUser')
        .setMessage('Ops, usuario inválido!')
        .add();
    }

    if (notification.verifyErrors()) {
      const data = result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(data);
    }

    const findTask = await this.taskRepo.findTitle(task.titleTask, user.id);

    const taskProps: CreateTaskProps = {
      titleTask: task.titleTask,
      descriptionTask: task.descriptionTask,
      status: task.status,
      titleAlreadyExists: !!findTask,
    };

    const validationResult = await taskSchemaValidator.execute(taskProps);

    if (!validationResult.success) {
      return result
        .setCode(400)
        .setNotification(validationResult.notifications)
        .setSuccess(false)
        .build();
    }

    return result.setSuccess(true).build();
  }

  async createTask(task: CreateTaskDto, category: Category | null, user: User) {
    const result = this.result();

    const taskCreated = await this.createTaskCore(task, user);

    if (!taskCreated.success) {
      return taskCreated;
    }

    const date = new Date();

    const createdBTaskBuilder = this.taskBuilder();
    createdBTaskBuilder.generateId();
    createdBTaskBuilder.setCategory(category);
    createdBTaskBuilder.setTitle(task.titleTask);
    createdBTaskBuilder.setDescription(task.descriptionTask);
    createdBTaskBuilder.setUser(user);
    createdBTaskBuilder.setCreateDate(date);
    createdBTaskBuilder.setUpdateDate(date);
    createdBTaskBuilder.setCompleted('Incompleta');
    createdBTaskBuilder.setStatus(
      task.status === 'Inativa' ? 'Inativa' : 'Ativa',
    );
    const taskBuild = createdBTaskBuilder.build();

    if (!taskBuild.success) {
      throw new NotificationException(taskBuild);
    }

    this.taskRepo.createTask(taskBuild.data);

    return result.setCode(200).setData(taskBuild.data).setSuccess(true).build();
  }

  async filterTodayTasks(idUser: string) {
    const notification = this.notification();
    const result = this.result();

    if (!isRequired(idUser)) {
      notification
        .setType('INFO')
        .setMessage('Ops! não encontramos tarefas de hoje para seu usuario')
        .add();
    }

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const findTasks = await this.taskRepo.findTodayTasks(idUser, start, end);

    if (!findTasks) {
      notification
        .setType('INFO')
        .setMessage('Ops! não encontramos tarefas de hoje para voce')
        .add();
    }

    notification.setType('INFO').setMessage('Opa, Suas tarefas de hoje').add();

    return result
      .setCode(200)
      .setNotification(notification.build())
      .setData(findTasks)
      .setSuccess(true)
      .build();
  }

  async filterWeekTasks(idUser: string) {
    const notification = this.notification();
    const result = this.result();

    if (!isRequired(idUser)) {
      notification
        .setType('INFO')
        .setMessage('Ops! não encontramos tarefas para seu usuario')
        .add();
    }

    const start = new Date();
    start.setDate(start.getDate() - start.getDay());
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    const findTasks = await this.taskRepo.findWeekTasks(idUser, start, end);

    if (!findTasks) {
      notification
        .setType('INFO')
        .setMessage('Ops! não encontramos tarefas desta semana para voce')
        .add();
    }

    notification
      .setType('INFO')
      .setMessage('Opa, Suas tarefas da semana estão aqui')
      .add();

    return result
      .setCode(200)
      .setNotification(notification.build())
      .setData(findTasks)
      .setSuccess(true)
      .build();
  }

  async filterMonthTasks(idUser: string) {
    const notification = this.notification();
    const result = this.result();

    if (!isRequired(idUser)) {
      notification
        .setType('INFO')
        .setMessage('Ops! não encontramos tarefas para seu usuario')
        .add();
    }

    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const findTasks = await this.taskRepo.findMonthTasks(idUser, start, end);

    if (!findTasks) {
      notification
        .setType('INFO')
        .setMessage('Ops! não encontramos tarefas deste mês para voce')
        .add();
    }

    notification
      .setType('INFO')
      .setMessage('Opa, Suas tarefas do mês estão aqui')
      .add();

    return result
      .setCode(200)
      .setNotification(notification.build())
      .setData(findTasks)
      .setSuccess(true)
      .build();
  }

  async filterAllPeriodTasks(idUser: string) {
    const notification = this.notification();
    const result = this.result();

    if (!isRequired(idUser)) {
      notification
        .setType('INFO')
        .setMessage('Ops! não encontramos tarefas para seu usuario')
        .add();
    }

    const findTasks = await this.taskRepo.findAllPeriodTasks(idUser);

    if (!findTasks) {
      notification
        .setType('INFO')
        .setMessage('Ops! não encontramos tarefas para voce')
        .add();
    }

    notification
      .setType('INFO')
      .setMessage('Opa, Todas as suas tarefas estão aqui')
      .add();

    return result
      .setCode(200)
      .setNotification(notification.build())
      .setData(findTasks)
      .setSuccess(true)
      .build();
  }

  private async updateTasksTitle(task: UpdateTaskDto) {
    const notification = this.notification();
    const result = this.result();

    if (!isRequired(task.idUser)) {
      notification
        .setType('ERROR')
        .setKey('idUser')
        .setMessage('Ops! id de usuário inválido')
        .add();
    }

    if (!isRequired(task.idTask)) {
      notification
        .setType('ERROR')
        .setKey('idTask')
        .setMessage('Ops! id de tarefa inválido')
        .add();
    }

    if (!isRequired(task.titleTask)) {
      notification
        .setType('ERROR')
        .setKey('titleTask')
        .setMessage('Ops! título inválido para atualizar')
        .add();
    }

    const existingTask = await this.taskRepo.findTitle(
      task.titleTask,
      task.idUser,
    );

    if (existingTask && !matches(existingTask.id, task.idTask)) {
      notification
        .setType('ERROR')
        .setKey('titleTask')
        .setMessage('Ops! Titulo da sua rotina já existe')
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

    const findTasks = await this.taskRepo.findById(task.idTask, task.idUser);

    if (!findTasks) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Tarefa não encontrada')
        .add();

      const resultException = result
        .setCode(404)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(resultException);
    }

    findTasks.title = task.titleTask;
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

      return data;
    } catch (e) {
      console.error(e);
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

  async deletedTask({ idTask, idUser }: { idTask: string; idUser: string }) {
    const notification = this.notification();
    const result = this.result();

    const deleteProps: DeleteTaskProps = { idTask, idUser };
    const validationResult =
      await deleteTaskSchemaValidator.execute(deleteProps);

    if (!validationResult.success) {
      return result
        .setCode(400)
        .setNotification(validationResult.notifications)
        .setSuccess(false)
        .build();
    }

    const findTasks = await this.taskRepo.findById(idTask, idUser);

    if (!findTasks) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Não conseguimos encontrar sua rotina')
        .add();

      result.setNotification(notification.build()).setSuccess(false);
      const resultException = result.build();

      throw new NotificationException(resultException);
    }

    if (!matches(findTasks.user.id, idUser)) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Você não tem permissão para deletar essa rotina')
        .add();

      result.setNotification(notification.build()).setSuccess(false);
      const resultException = result.build();

      throw new NotificationException(resultException);
    }

    findTasks.deleteAt = new Date();
    this.persist.persist(findTasks);

    try {
      await this.persist.commit();

      notification
        .setType('INFO')
        .setMessage('Opa, Sua rotina foi deletada')
        .add();

      const data = result
        .setCode(200)
        .setData(this.persist.fromObject(findTasks))
        .setNotification(notification.build())
        .setSuccess(true)
        .build();

      return data;
    } catch (e) {
      console.error(e);

      notification
        .setType('ERROR')
        .setMessage('Ops! Ocorreu um erro ao deletar sua rotina')
        .add();

      result.setNotification(notification.build()).setSuccess(false);
      const resultException = result.build();

      throw new NotificationException(resultException);
    }
  }

  async allTasksDeleted(idUser: string, idCategory: string) {
    return await this.taskRepo.deleteAllTasks(idCategory, idUser);
  }

  async allTasksUpdateStatus(
    idUser: string,
    idCategory: string,
    completed: string,
  ) {
    const notification = this.notification();
    const result = this.result();

    if (!isInEnum(completed, ['concluída', 'incompleta'])) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Seu status está inválido para atualização')
        .add();

      result.setNotification(notification.build()).setSuccess(false);
      const resultException = result.build();

      throw new NotificationException(resultException);
    }

    return await this.taskRepo.allUpdateTasks(idUser, idCategory, completed);
  }

  async updateTasksStatus(task: UpdateTaskDto) {
    const notification = this.notification();
    const result = this.result();

    if (!isRequired(task.idTask)) {
      notification
        .setType('ERROR')
        .setKey('idTask')
        .setMessage('Ops! id de rotina inválido')
        .add();
    }

    if (!isRequired(task.idUser)) {
      notification
        .setType('ERROR')
        .setKey('idUser')
        .setMessage('Ops! id de usuário inválido')
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

    const findTasks = await this.taskRepo.findById(task.idTask, task.idUser);

    if (!findTasks) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Sua rotina não foi encontrada')
        .add();

      result
        .setCode(404)
        .setNotification(notification.build())
        .setSuccess(false);
      const resultException = result.build();

      throw new NotificationException(resultException);
    }

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

      return data;
    } catch (e) {
      console.error(e);

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

  private async updateTasksDescription(task: UpdateTaskDto) {
    const notification = this.notification();
    const result = this.result();

    if (!isRequired(task.idUser)) {
      notification
        .setType('ERROR')
        .setKey('idUser')
        .setMessage('Ops! id de usuário inválido')
        .add();
    }

    if (!isRequired(task.idTask)) {
      notification
        .setType('ERROR')
        .setKey('idTask')
        .setMessage('Ops! id dá sua rotina é inválido')
        .add();
    }

    if (!isRequired(task.descriptionTask)) {
      notification
        .setType('ERROR')
        .setKey('descriptionTask')
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

    const findTasks = await this.taskRepo.findById(task.idTask, task.idUser);

    if (!findTasks) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Não encontramos suas tarefas')
        .add();

      result
        .setCode(404)
        .setNotification(notification.build())
        .setSuccess(false);
      const resultException = result.build();

      throw new NotificationException(resultException);
    }

    findTasks.description = task.descriptionTask;

    try {
      await this.persist.commit();

      notification
        .setType('INFO')
        .setMessage('Opa! A descrição da sua rotina foi atualizada')
        .add();

      const data = result
        .setCode(200)
        .setData(this.persist.fromObject(findTasks))
        .setNotification(notification.build())
        .setSuccess(true)
        .build();

      return data;
    } catch (e) {
      console.error(e);

      notification
        .setType('ERROR')
        .setMessage(
          'Ops! Tivemos um erro interno ao salvar a descrição da sua rotina',
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

  async findTasks(idUser: string, idTasks: string) {
    const notification = this.notification();
    const result = this.result();

    const findProps: FindTaskProps = { idUser, idTasks };
    const validationResult = await findTaskSchemaValidator.execute(findProps);

    if (!validationResult.success) {
      return result
        .setCode(400)
        .setNotification(validationResult.notifications)
        .setSuccess(false)
        .build();
    }

    const findTasks = await this.taskRepo.findById(idTasks, idUser);

    if (findTasks) {
      const data = result
        .setCode(200)
        .setData(findTasks)
        .setSuccess(true)
        .setNotification(notification.build())
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

    if (!isRequired(idUser)) {
      notification
        .setType('ERROR')
        .setKey('idUser')
        .setMessage('Ops! id de usuário inválido')
        .add();
    }

    const findTasks = await this.taskRepo.findAllTasksUser(idUser);

    if (!findTasks) {
      notification
        .setType('ERROR')
        .setKey('idUser')
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
        .setNotification(notification.build())
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

    const searchProps: SearchTaskProps = { idUser, search };
    const validationResult =
      await searchTaskSchemaValidator.execute(searchProps);

    if (!validationResult.success) {
      return result
        .setCode(400)
        .setNotification(validationResult.notifications)
        .setSuccess(false)
        .build();
    }

    const searchData = await this.taskRepo.searchTask(search, idUser);
    const data = result
      .setCode(200)
      .setSuccess(true)
      .setData(searchData)
      .setNotification(notification.build())
      .build();

    return data;
  }

  async findAllRascunhos(id: string) {
    const notification = this.notification();
    const result = this.result();

    if (!isRequired(id)) {
      notification
        .setType('ERROR')
        .setKey('id')
        .setMessage('Ops, id inválido')
        .add();

      const data = result
        .setCode(404)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(data);
    }

    const findAllRascunhos = await this.taskRepo.findAllRascunhos(id);
    const data = result
      .setCode(200)
      .setSuccess(true)
      .setData(findAllRascunhos)
      .build();

    return data;
  }

  async taskUpdate(task: UpdateTaskDto) {
    const updateProps: UpdateTaskProps = {
      titleTask: task.titleTask,
      descriptionTask: task.descriptionTask,
      completed: task.completed,
    };

    const validationResult =
      await updateTaskSchemaValidator.execute(updateProps);

    if (!validationResult.success) {
      const result = this.result();
      return result
        .setCode(400)
        .setNotification(validationResult.notifications)
        .setSuccess(false)
        .build();
    }

    if (task.titleTask && task.idTask && task.idUser) {
      return await this.updateTasksTitle(task);
    }

    if (task.completed && task.idTask && task.idUser) {
      return await this.updateTasksStatus(task);
    }

    if (task.descriptionTask && task.idTask && task.idUser) {
      return await this.updateTasksDescription(task);
    }
  }
}

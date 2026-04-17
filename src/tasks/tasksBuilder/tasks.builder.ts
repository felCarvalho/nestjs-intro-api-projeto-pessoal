import { Tasks } from '../entity/tasks.entity';
import { TaskBuilderContract } from '../contracts/index.contracts';
import { NotificationBuilderContract } from '../../shared/core/contracts/contracts.notification';
import { ResultBuilderContract } from '../../shared/core/contracts/contracts.result';
import { ICategory, IUser } from '../../shared/core/types/types';
import { BuilderCore } from '../../shared/core/builderCore/builder.core';

export class TasksBuilder
  extends BuilderCore
  implements TaskBuilderContract<Tasks | Tasks[]>
{
  protected task: Tasks;
  protected result: ResultBuilderContract<Tasks | Tasks[]>;
  protected notification: NotificationBuilderContract;

  constructor(
    result: ResultBuilderContract<Tasks | Tasks[]>,
    notification: NotificationBuilderContract,
    tasks: Tasks = new Tasks(),
  ) {
    super(notification, tasks);
    this.task = tasks;
    this.result = result;
    this.notification = notification;
  }

  setTitle(title: string) {
    if (!title) {
      this.notification
        .setType('ERROR')
        .setMessage('Ops, erro ao validar o title da task')
        .add();
    }

    this.task.title = title;
    return this;
  }

  setDescription(description: string) {
    this.task.description = description;
    return this;
  }

  setStatus(status: string) {
    if (!status) {
      this.notification
        .setType('ERROR')
        .setMessage('Ops, erro ao validar o status da tarefa')
        .add();
    }

    this.task.status = status;
    return this;
  }

  setCompleted(completed: 'Incompleta' | 'Concluída' | 'Rascunho') {
    if (!completed) {
      this.notification
        .setType('ERROR')
        .setMessage('Ops, erro ao validar o status da task')
        .add();
    }

    this.task.completed = completed;
    return this;
  }

  setCategory(category: ICategory) {
    if (!category) {
      this.notification
        .setType('ERROR')
        .setMessage('Ops! erro ao validar id da categoria')
        .add();
    }

    this.task.category = category;
    return this;
  }

  setUser(user: IUser) {
    if (!user) {
      this.notification
        .setType('ERROR')
        .setMessage('Ops! erro ao validar id do usuário')
        .add();
    }

    this.task.user = user;
    return this;
  }

  build() {
    const notification = this.notification;
    const result = this.result;

    if (notification.verifyErrors()) {
      result.setNotification(notification.build());
      result.setSuccess(false);

      return result.build();
    }

    const { data, task } = this;
    result.setData({ ...task, ...data });
    result.setNotification(notification.build());
    result.setSuccess(true);

    return result.build();
  }
}

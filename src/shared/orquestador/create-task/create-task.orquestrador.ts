import { TasksService } from '../../../tasks/service/task.service';
import { UsersService } from '../../../users/service/users.service';
import { CategoryService } from '../../../category/service/category.service';
import { NotificationBuilderContract } from '../../../shared/core/contracts/contracts.notification';
import { ResultBuilderContract } from '../../../shared/core/contracts/contracts.result';
import { TransactionContract } from '../../../shared/core/contracts/contracts.transaction';
import { Tasks } from '../../../tasks/entity/tasks.entity';
import { PersistContract } from '../../../shared/core/contracts/contracts.persistence';
import { CreateTaskDto } from './create-task.dto';
import { NotificationException } from '../../core/@custom-decorators/exception-custom/exception';
import { Category } from '../../../category/entity/category.entity';

export class CreateTaskOrquestador {
  constructor(
    private readonly tasksService: TasksService,
    private readonly usersService: UsersService,
    private readonly categoryService: CategoryService,
    private readonly notificationBuilder: () => NotificationBuilderContract,
    private readonly result: () => ResultBuilderContract<Tasks>,
    private readonly transaction: TransactionContract,
    private readonly persist: PersistContract<Tasks>,
  ) {}

  async createTask(taskDto: CreateTaskDto, idUser: string) {
    const notification = this.notificationBuilder();
    const result = this.result();

    if (!idUser) {
      notification.setType('ERROR').setMessage('Ops! usuário inválido').add();
    }

    if (!taskDto.idCategory) {
      notification
        .setType('ERROR')
        .setMessage('Ops! id de categoria inválido')
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

    return await this.transaction.runTransaction(async () => {
      const findUser = await this.usersService.findUserById(idUser);

      if (!findUser.success) {
        throw new NotificationException(findUser);
      }

      const findCategory = await this.categoryService.findByCategory(
        taskDto.idCategory,
        idUser,
      );

      if (!findCategory.success) {
        throw new NotificationException(findCategory);
      }

      const taskCreated = await this.tasksService.createTask(
        taskDto,
        findCategory.data as Category,
        findUser.data,
      );

      if (!taskCreated.success) {
        throw new NotificationException(taskCreated);
      }

      try {
        await this.persist.commit();

        notification
          .setType('INFO')
          .setMessage('Opa! Sua tarefa foi criada com sucesso')
          .add();

        return result
          .setCode(200)
          .setData(taskCreated.data as Tasks)
          .setNotification(notification.build())
          .setSuccess(true)
          .build();
      } catch (e) {
        console.error(e);
        notification
          .setType('ERROR')
          .setMessage('Ops! erro ao criar sua tarefa')
          .add();

        const data = result
          .setCode(500)
          .setNotification(notification.build())
          .setSuccess(false)
          .build();

        throw new NotificationException(data);
      }
    });
  }
}

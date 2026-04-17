import { CategoryService } from '../../../category/service/category.service';
import { TasksService } from '../../../tasks/service/task.service';
import { NotificationException } from '../../core/@custom-decorators/exception-custom/exception';
import { NotificationBuilderContract } from '../../core/contracts/contracts.notification';
import { ResultBuilderContract } from '../../core/contracts/contracts.result';
import { Tasks } from '../../../tasks/entity/tasks.entity';
import { TransactionContract } from '../../core/contracts/contracts.transaction';
import { UsersService } from '../../../users/service/users.service';

export class DeleteAllCategoryTaskOrquestrador {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly taskService: TasksService,
    private readonly userService: UsersService,
    private readonly notification: () => NotificationBuilderContract,
    private readonly result: () => ResultBuilderContract<Tasks>,
    private readonly transaction: TransactionContract,
  ) {}

  async deleteAllCategoryTask(id: string, idUser: string) {
    const notification = this.notification();
    const result = this.result();

    if (!id) {
      notification
        .setType('ERROR')
        .setMessage('Ops, id de categoria inválido')
        .add();
    }

    if (!idUser) {
      notification
        .setType('ERROR')
        .setMessage('Ops, id de usuario inválido')
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
      const findUser = await this.userService.findUserById(idUser);

      if (!findUser) {
        notification
          .setType('ERROR')
          .setMessage('Ops, usuário não encontrado')
          .add();

        const data = result
          .setCode(400)
          .setNotification(notification.build())
          .setSuccess(false)
          .build();

        throw new NotificationException(data);
      }

      const findCategory = await this.categoryService.findByCategory(
        id,
        idUser,
      );

      if (!findCategory) {
        notification
          .setType('ERROR')
          .setMessage('Ops, categoria não encontrada')
          .add();

        const data = result
          .setCode(400)
          .setNotification(notification.build())
          .setSuccess(false)
          .build();

        throw new NotificationException(data);
      }

      try {
        await this.categoryService.deleteCategoryAllTasks(id, idUser);
        await this.taskService.allTasksDeleted(idUser, id);

        notification
          .setType('INFO')
          .setMessage('Todas as tarefas foram deletadas')
          .add();

        return result
          .setCode(200)
          .setNotification(notification.build())
          .setSuccess(true)
          .build();
      } catch (e) {
        console.error(e);

        notification
          .setType('ERROR')
          .setMessage('Ops, erro ao deletar suas tarefas')
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

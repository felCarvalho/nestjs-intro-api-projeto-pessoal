import { CategoryService } from '../../../category/service/category.service';
import { TasksService } from '../../../tasks/service/task.service';
import { NotificationException } from '../../core/@custom-decorators/exception-custom/exception';
import { NotificationBuilderContract } from '../../core/contracts/contracts.notification';
import { ResultBuilderContract } from '../../core/contracts/contracts.result';
import { Tasks } from '../../../tasks/entity/tasks.entity';
import { TransactionContract } from '../../core/contracts/contracts.transaction';
import { UpdateCategoryTaskDto } from './update-status-.category-task.dto';
import { UsersService } from '../../../users/service/users.service';

export class UpdateCategoryTaskOrquestrador {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly taskService: TasksService,
    private readonly userService: UsersService,
    private readonly notification: () => NotificationBuilderContract,
    private readonly result: () => ResultBuilderContract<Tasks>,
    private readonly transaction: TransactionContract,
  ) {}

  async updateStatusCategoryAndTasks(
    updateDto: UpdateCategoryTaskDto,
    idCategory: string,
    idUser: string,
  ) {
    const notification = this.notification();
    const result = this.result();

    if (!idUser) {
      notification.setType('ERROR').setMessage('Ops, usuário inválido').setKey('idUser').add();
    }

    if (!idCategory) {
      notification.setType('ERROR').setMessage('Ops, id de categoria inválido').setKey('idCategory').add();
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

      if (!findUser.success) {
        throw new NotificationException(findUser);
      }

      const findCategory = await this.categoryService.findByCategory(
        idCategory,
        idUser,
      );

      if (!findCategory.success) {
        throw new NotificationException(findCategory);
      }

      try {
        await this.taskService.allTasksUpdateStatus(
          findUser.data.id,
          idCategory,
          updateDto.completed,
        );
        notification
          .setType('INFO')
          .setMessage('Opa, Suas rotinas foram atualizadas')
          .setKey('idCategory')
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
          .setMessage('Ops, erro ao atualizar o status das tarefas')
          .setKey('idCategory')
          .add();
        const data = result
          .setNotification(notification.build())
          .setSuccess(false)
          .setCode(500)
          .build();

        throw new NotificationException(data);
      }
    });
  }
}

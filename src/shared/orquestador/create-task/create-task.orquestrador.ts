import { CategoryService } from '../../../category/service/category.service';
import { TasksService } from '../../../tasks/service/task.service';
import { NotificationException } from '../../core/@custom-decorators/exception-custom/exception';
import { NotificationBuilderContract } from '../../core/contracts/contracts.notification';
import { ResultBuilderContract } from '../../core/contracts/contracts.result';
import { Tasks } from '../../../tasks/entity/tasks.entity';
import { TransactionContract } from '../../core/contracts/contracts.transaction';
import { CreateTaskDto } from './create.dto';
import { UserRepositoryContract } from '../../../users/contracts/index.contract';
import { User } from '../../../users/entity/user.entity';

export class CreateTaskOrquestrador {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly taskService: TasksService,
    private readonly notification: () => NotificationBuilderContract,
    private readonly result: () => ResultBuilderContract<Tasks>,
    private readonly transaction: TransactionContract,
    private readonly userRepo: UserRepositoryContract<User>,
  ) {}

  async syncCategoryAndTasks(createTasksDto: CreateTaskDto, idUser: string) {
    const notification = this.notification();
    const result = this.result();

    if (!idUser) {
      notification
        .setType('ERROR')
        .setMessage('Ops! id de usuário inválido')
        .add();

      result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false);

      throw new NotificationException(result.build());
    }

    return await this.transaction.runTransaction(async () => {
      const findUser = await this.userRepo.findById(idUser);

      if (!findUser) {
        notification
          .setType('ERROR')
          .setMessage('Ops! Seu usuário não foi encontrado')
          .add();

        result
          .setCode(404)
          .setNotification(notification.build())
          .setSuccess(false);

        throw new NotificationException(result.build());
      }

      const categoryCreated = await this.categoryService.createCategory(
        { ...createTasksDto },
        findUser,
      );

      if (!categoryCreated) {
        notification
          .setType('ERROR')
          .setMessage('Ops! Não conseguimos criar sua tasks')
          .add();

        result
          .setCode(400)
          .setNotification(notification.build())
          .setSuccess(false);

        throw new NotificationException(result.build());
      }

      const taskCreated = await this.taskService.createRotina(
        { ...createTasksDto },
        { ...categoryCreated.data },
        findUser,
      );

      if (!taskCreated) {
        notification
          .setType('ERROR')
          .setMessage('Ops! Não conseguimos criar sua tasks')
          .add();

        result
          .setCode(400)
          .setNotification(notification.build())
          .setSuccess(false);

        throw new NotificationException(result.build());
      }
    });
  }
}

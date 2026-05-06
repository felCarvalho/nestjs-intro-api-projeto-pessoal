import { CategoryService } from '../../../category/service/category.service';
import { TasksService } from '../../../tasks/service/task.service';
import { UsersService } from '../../../users/service/users.service';
import { NotificationException } from '../../core/@custom-decorators/exception-custom/exception';
import { NotificationBuilderContract } from '../../core/contracts/contracts.notification';
import { ResultBuilderContract } from '../../core/contracts/contracts.result';
import { Tasks } from '../../../tasks/entity/tasks.entity';
import { TransactionContract } from '../../core/contracts/contracts.transaction';
import { CreateRotinaDto } from './create-rotina.dto';
import { Category } from '../../../category/entity/category.entity';
import { rotinaSchemaValidator, CreateRotinaProps } from '../../core/strategy';

export class CreateRotinaOrquestrador {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly taskService: TasksService,
    private readonly usersService: UsersService,
    private readonly notification: () => NotificationBuilderContract,
    private readonly result: () => ResultBuilderContract<Tasks>,
    private readonly transaction: TransactionContract,
  ) {}

  async createCategoryAndTasks(
    createRotinaDto: CreateRotinaDto,
    idUser: string,
  ) {
    const notification = this.notification();
    const result = this.result();

    if (!idUser) {
      notification
        .setType('ERROR')
        .setMessage('Ops! id de usuário inválido')
        .setKey('idUser')
        .add();
    }

    const rotinaProps: CreateRotinaProps = {
      titleTask: createRotinaDto.titleTask,
      descriptionTask: createRotinaDto.descriptionTask,
      titleCategory: createRotinaDto.titleCategory,
      descriptionCategory: createRotinaDto.descriptionCategory,
      status: createRotinaDto.status,
    };

    const rotinaValidation = await rotinaSchemaValidator.execute(rotinaProps);

    if (!rotinaValidation.success) {
      for (const notif of rotinaValidation.notifications) {
        notification.setType('ERROR').setMessage(notif.message).add();
      }
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

      const categoryCreated = await this.categoryService.createCategory(
        createRotinaDto,
        findUser.data,
      );

      const taskCreated = await this.taskService.createTask(
        createRotinaDto,
        categoryCreated.data as Category,
        findUser.data,
      );

      const notificationResult = categoryCreated.notification.concat(
        taskCreated.notification,
      );

      if (!categoryCreated.success || !taskCreated.success) {
        const data = result
          .setCode(400)
          .setNotification(notificationResult)
          .setSuccess(false)
          .build();

        throw new NotificationException(data);
      }

      notification
        .setType('INFO')
        .setMessage(`Opa @${findUser.data.name}, sua rotina foi criada!`)
        .setKey('name')
        .add();

      return result
        .setCode(200)
        .setData(taskCreated.data as Tasks)
        .setNotification(notification.build())
        .setSuccess(true)
        .build();
    });
  }
}

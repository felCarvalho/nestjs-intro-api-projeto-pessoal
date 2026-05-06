import { TasksService } from '../../../tasks/service/task.service';
import { CategoryService } from '../../../category/service/category.service';
import { NotificationBuilderContract } from '../../core/contracts/contracts.notification';
import { ResultBuilderContract } from '../../core/contracts/contracts.result';
import { NotificationException } from '../../core/@custom-decorators/exception-custom/exception';

export class GetAllTaskCategoryActiveOrquestrador {
  constructor(
    private readonly tasksService: TasksService,
    private readonly categoryService: CategoryService,
    private readonly notification: () => NotificationBuilderContract,
    private readonly result: () => ResultBuilderContract<any>,
  ) {}

  async getAllTaskCategoryActive(idUser: string, idCategory: string) {
    const notification = this.notification();
    const result = this.result();

    if (!idCategory) {
      notification.setType('ERROR').setMessage('Ops, id da categoria inválido').setKey('idCategory').add();
    }

    if (!idUser) {
      notification.setType('ERROR').setMessage('Ops, id do usuário inválido').setKey('idUser').add();
    }

    if (notification.verifyErrors()) {
      const data = result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();
      throw new NotificationException(data);
    }

    const findCategory = await this.categoryService.findByCategory(
      idCategory,
      idUser,
    );

    if (!findCategory.success) {
      throw new NotificationException(findCategory);
    }

    const tasks = await this.tasksService.findAllTasks(idUser);

    if (!tasks.success) {
      throw new NotificationException(tasks);
    }

    notification.setType('INFO').setMessage('Opa, suas tarefas ativas').setKey('idCategory').add();

    return result
      .setCode(200)
      .setData({ category: findCategory.data, tasks: tasks.data })
      .setNotification(notification.build())
      .setSuccess(true)
      .build();
  }
}

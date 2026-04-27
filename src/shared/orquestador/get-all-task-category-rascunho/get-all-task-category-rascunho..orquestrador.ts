import { TasksService } from '../../../tasks/service/task.service';
import { CategoryService } from '../../../category/service/category.service';
import { NotificationBuilderContract } from '../../core/contracts/contracts.notification';
import { ResultBuilderContract } from '../../core/contracts/contracts.result';
import { NotificationException } from '../../core/@custom-decorators/exception-custom/exception';

export class GetAllTaskCategoryRascunhoOrquestrador {
  constructor(
    private readonly tasksService: TasksService,
    private readonly categoryService: CategoryService,
    private readonly notificationBuilder: () => NotificationBuilderContract,
    private readonly resultBuilder: () => ResultBuilderContract<unknown>,
  ) {}

  async getAllTaskCategoryRascunho({ idUser }: { idUser: string }) {
    const notification = this.notificationBuilder();
    const result = this.resultBuilder();

    if (!idUser) {
      notification
        .setType('ERROR')
        .setMessage('Ops, Seu usuario não foi encontrado')
        .add();

      const data = result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(true)
        .build();

      throw new NotificationException(data);
    }

    try {
      const [categories, tasks] = await Promise.all([
        this.categoryService.findAllCategoriesRascunhos(idUser),
        this.tasksService.findAllRascunhos(idUser),
      ]);

      console.log({ categories }, { tasks });

      notification
        .setType('INFO')
        .setMessage('Opa, suas categorias e tarefas de rascunhos aqui')
        .add();

      const data = {
        t: tasks.data,
        c: categories.data,
      };

      return result
        .setCode(200)
        .setNotification(notification.build())
        .setData(data)
        .setSuccess(true)
        .build();
    } catch (e) {
      console.error(e);
      notification
        .setType('ERROR')
        .setMessage('Ops, tivemos um problema ao ler suas informações')
        .add();

      const data = result
        .setCode(500)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(data);
    }
  }
}

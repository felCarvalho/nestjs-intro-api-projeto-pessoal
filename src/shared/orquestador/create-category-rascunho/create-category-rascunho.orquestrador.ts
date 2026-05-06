import { CategoryService } from '../../../category/service/category.service';
import { UsersService } from '../../../users/service/users.service';
import { NotificationBuilderContract } from '../../../shared/core/contracts/contracts.notification';
import { ResultBuilderContract } from '../../../shared/core/contracts/contracts.result';
import { TransactionContract } from '../../../shared/core/contracts/contracts.transaction';
import { Category } from '../../../category/entity/category.entity';
import { PersistContract } from '../../../shared/core/contracts/contracts.persistence';
import { CreateCategoryRascunhoDto } from './create-category-rascunho.dto';
import { NotificationException } from '../../../shared/core/@custom-decorators/exception-custom/exception';

export class CreateCategoryRascunhoOrquestador {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly usersService: UsersService,
    private readonly notification: () => NotificationBuilderContract,
    private readonly result: () => ResultBuilderContract<Category>,
    private readonly transaction: TransactionContract,
    private readonly persist: PersistContract<Category>,
  ) {}

  async createCategoryRascunho(
    categoryDto: CreateCategoryRascunhoDto,
    idUser: string,
  ) {
    const notification = this.notification();
    const result = this.result();

    if (!idUser) {
      notification.setType('ERROR').setMessage('Ops, usuário inválido para criar categoria').setKey('idUser').add();
    }

    if (!categoryDto.titleCategory) {
      notification.setType('ERROR').setMessage('Ops, impossivel criar categoria sem um titulo').setKey('titleCategory').add();
    }

    if (!categoryDto.descriptionCategory) {
      notification
        .setType('INFO')
        .setMessage('Ops, categoria criada sem descrição')
        .setKey('titleCategory')
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

      if (!findUser || !findUser.success) {
        notification.setType('ERROR').setMessage('Ops, usuário não encontrado').setKey('idUser').add();
        if (notification.verifyErrors()) {
          const data = result
            .setCode(404)
            .setNotification(notification.build())
            .setSuccess(false)
            .build();
          throw new NotificationException(data);
        }
      }

      const createCategory = await this.categoryService.createCategory(
        categoryDto,
        findUser.data,
      );

      if (!createCategory.success) {
        throw new NotificationException(createCategory);
      }

      try {
        await this.persist.commit();

        notification
          .setType('INFO')
          .setMessage('Opa, sua categoria de rascunho foi criada')
          .setKey('titleCategory')
          .add();

        return result
          .setCode(200)
          .setData(createCategory.data as Category)
          .setNotification(notification.build())
          .setSuccess(true)
          .build();
      } catch (e) {
        console.error(e);

        notification
          .setType('ERROR')
          .setMessage(
            'Ops, tivemos um problema ao criar seu rascunho de categoria',
          )
          .setKey('titleCategory')
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

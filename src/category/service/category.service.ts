import { Category } from '../entity/category.entity';
import { CategoryBuilderContracts } from '../contracts/index.contracts';
import { CategoryRepositoryContracts } from '../contracts/index.contracts';
import { NotificationBuilderContract } from '../../shared/core/contracts/contracts.notification';
import { ResultBuilderContract } from '../../shared/core/contracts/contracts.result';
import { NotificationException } from '../../shared/core/@custom-decorators/exception-custom/exception';
import { User } from '../../users/entity/user.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';

export class CategoryService {
  constructor(
    private readonly notification: () => NotificationBuilderContract,
    private readonly result: () => ResultBuilderContract<Category>,
    private readonly categoryRepo: CategoryRepositoryContracts<Category>,
    private readonly categoryBuilder: () => CategoryBuilderContracts<Category>,
  ) {}

  verifyMaxLength(data: string, maxLength: number) {
    if (data.length > maxLength) {
      return true;
    }

    return false;
  }

  verifyMinLength(data: string, minLength: number) {
    if (data.length < minLength) {
      return true;
    }

    return false;
  }

  async createCategory(category: CreateCategoryDto, user: User) {
    const notification = this.notification();
    const result = this.result();

    if (!user.id) {
      notification
        .setType('ERROR')
        .setMessage('Ops! id de usuário inválido')
        .add();
    }

    if (!category.titleCategory) {
      notification
        .setType('ERROR')
        .setMessage('Ops! titulo da rotina inválido')
        .add();
    }

    if (!category.descriptionCategory) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Sua  descrição está inválida')
        .add();
    }

    const findCategory = await this.categoryRepo.findTitle(
      category.titleCategory,
    );

    if (findCategory) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Já existe uma categoria com esse mesmo titulo')
        .add();
    }

    const date = new Date().toISOString();

    const categoryBuilder = this.categoryBuilder();
    categoryBuilder.generateId();
    categoryBuilder.setCategory(category.titleCategory);
    categoryBuilder.setDescription(category.descriptionCategory);
    categoryBuilder.setUser(user);
    categoryBuilder.setCreateDate(date);
    categoryBuilder.setUpdateDate(date);
    const categoryBuild = categoryBuilder.build();
    console.log(categoryBuild)

    if (!categoryBuild.success) {
      notification
        .setType('ERROR')
        .setMessage('Ops! Erro ao criar categoria')
        .add();
    }

    if (
      categoryBuild.success &&
      this.verifyMinLength(categoryBuild.data.title, 5)
    ) {
      notification
        .setType('WARNING')
        .setMessage('Ops! Titulo da categoria está muito curto')
        .add();
    }

    if (
      categoryBuild.success &&
      this.verifyMaxLength(categoryBuild.data.title, 255)
    ) {
      notification
        .setType('WARNING')
        .setMessage('Ops! Titulo da categoria está muito longo')
        .add();
    }

    if (
      categoryBuild.success &&
      this.verifyMaxLength(categoryBuild.data.description, 400)
    ) {
      notification
        .setType('WARNING')
        .setMessage('Ops! Descrição está muito longa')
        .add();
    }

    if (notification.verifyErrors() || notification.verifyWarnings()) {
      result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false);
      const resultException = result.build();

      throw new NotificationException(resultException);
    }

    notification
      .setType('INFO')
      .setMessage('Opa! Sua categoria foi criada')
      .add();

    const data = result
      .setCode(200)
      .setData(categoryBuild.data)
      .setNotification(notification.build())
      .setSuccess(true)
      .build();

    this.categoryRepo.createCategory(data.data);
    return data;
  }
}

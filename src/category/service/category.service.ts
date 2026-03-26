import { Category } from '../entity/category.entity';
import { CategoryBuilderContracts } from '../contracts/index.contracts';
import { CategoryRepositoryContracts } from '../contracts/index.contracts';
import { NotificationBuilderContract } from '../../shared/core/contracts/contracts.notification';
import { ResultBuilderContract } from '../../shared/core/contracts/contracts.result';
import { NotificationException } from '../../shared/core/@custom-decorators/exception-custom/exception';
import { User } from '../../users/entity/user.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UserRepositoryContract } from '../../users/contracts/index.contract';
import { PersistContract } from '../../shared/core/contracts/contracts.persistence';

export class CategoryService {
  constructor(
    private readonly notification: () => NotificationBuilderContract,
    private readonly result: () => ResultBuilderContract<Category>,
    private readonly categoryRepo: CategoryRepositoryContracts<Category>,
    private readonly categoryBuilder: () => CategoryBuilderContracts<Category>,
    private readonly userRepo: UserRepositoryContract<User>,
    private readonly persist: PersistContract<Category>,
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

  async createCategoryCore(category: CreateCategoryDto, user: User) {
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

    if (notification.verifyErrors()) {
      return result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();
    }

    if (!category.descriptionCategory) {
      notification
        .setType('INFO')
        .setMessage('Ops! Sua descrição está inválida')
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

      return result
        .setCode(409)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();
    }

    if (this.verifyMinLength(category.titleCategory, 5)) {
      notification
        .setType('WARNING')
        .setMessage('Ops! Titulo da categoria está muito curto')
        .add();
    }

    if (this.verifyMaxLength(category.titleCategory, 255)) {
      notification
        .setType('WARNING')
        .setMessage('Ops! Titulo da categoria está muito longo')
        .add();
    }

    if (this.verifyMaxLength(category.descriptionCategory, 400)) {
      notification
        .setType('WARNING')
        .setMessage('Ops! Descrição está muito longa')
        .add();
    }

    if (notification.verifyErrors() || notification.verifyWarnings()) {
      return result
        .setCode(404)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();
    }

    return result.setSuccess(true).build();
  }

  async createCategoryTransaction(category: CreateCategoryDto, user: User) {
    const result = this.result();
    const notification = this.notification();

    const verifyCategoryCreated = await this.createCategoryCore(category, user);

    if (!verifyCategoryCreated.success) {
      throw new NotificationException(verifyCategoryCreated);
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

    if (!categoryBuild.success) {
      const data = result
        .setCode(400)
        .setNotification(categoryBuild.notification)
        .setSuccess(false)
        .build();

      throw new NotificationException(data);
    }

    notification
      .setType('INFO')
      .setMessage('Opa, sua categoria foi criada')
      .add();

    return result
      .setCode(200)
      .setData(categoryBuild.data)
      .setNotification(notification.build())
      .setSuccess(true)
      .build();
  }

  async createCategory(category: CreateCategoryDto, user: string) {
    const notification = this.notification();
    const result = this.result();

    const findUser = await this.userRepo.findById(user);

    if (!findUser) {
      notification.setType('ERROR').setMessage('Ops, usúario inválido').add();

      const data = result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(data);
    }

    const createdCategory = await this.createCategoryTransaction(
      category,
      findUser,
    );

    if (!createdCategory.success) {
      throw new NotificationException(createdCategory);
    }

    this.categoryRepo.createCategory(createdCategory.data);

    try {
      await this.persist.commit();

      return createdCategory;
    } catch (error) {
      console.error(error);
      notification
        .setType('ERROR')
        .setMessage('Ops, tiveos um erro ao salvar sua categoria')
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

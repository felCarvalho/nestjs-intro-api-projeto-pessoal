import { Category } from '../entity/category.entity';
import { CategoryBuilderContracts } from '../contracts/index.contracts';
import { CategoryRepositoryContracts } from '../contracts/index.contracts';
import { NotificationBuilderContract } from '../../shared/core/contracts/contracts.notification';
import { ResultBuilderContract } from '../../shared/core/contracts/contracts.result';
import { NotificationException } from '../../shared/core/@custom-decorators/exception-custom/exception';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { PersistContract } from '../../shared/core/contracts/contracts.persistence';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { User } from '../../users/entity/user.entity';

export class CategoryService {
  constructor(
    private readonly notification: () => NotificationBuilderContract,
    private readonly result: () => ResultBuilderContract<Category | Category[]>,
    private readonly categoryRepo: CategoryRepositoryContracts<Category>,
    private readonly categoryBuilder: () => CategoryBuilderContracts<Category>,
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

  private async createCategoryCore(category: CreateCategoryDto, user: User) {
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
      user.id,
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
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();
    }

    return result
      .setSuccess(true)
      .setNotification(notification.build())
      .build();
  }

  async createCategory(category: CreateCategoryDto, user: User) {
    const result = this.result();

    const verifyCategoryCreated = await this.createCategoryCore(category, user);

    if (!verifyCategoryCreated.success) {
      throw new NotificationException(verifyCategoryCreated);
    }

    const date = new Date();

    const categoryBuilder = this.categoryBuilder();
    categoryBuilder.generateId();
    categoryBuilder.setCategory(category.titleCategory);
    categoryBuilder.setDescription(category.descriptionCategory);
    categoryBuilder.setStatus(
      category.status === 'Inativa' ? 'Inativa' : 'Ativa',
    );
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

      return data;
    }

    this.categoryRepo.createCategory(categoryBuild.data);

    return result.setData(categoryBuild.data).setSuccess(true).build();
  }

  async findByCategory(categoryId: string, idUser: string) {
    const notification = this.notification();
    const result = this.result();

    if (!idUser) {
      notification.setType('ERROR').setMessage('Ops, usuário inválido').add();
      const data = result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(data);
    }

    const findCategory = await this.categoryRepo.findById(categoryId, idUser);

    if (!findCategory) {
      notification
        .setType('ERROR')
        .setMessage('Ops, Não encontramos sua categoria')
        .add();

      const data = result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(data);
    }

    return result
      .setCode(200)
      .setData(findCategory)
      .setNotification(notification.build())
      .setSuccess(true)
      .build();
  }

  async findAllCategories(idUser: string) {
    const notification = this.notification();
    const result = this.result();

    if (!idUser) {
      notification
        .setType('ERROR')
        .setMessage('Ops, Seu usuario não foi encontrado')
        .add();

      const data = result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(data);
    }

    const findAllCategorieUser =
      await this.categoryRepo.findAllByUserId(idUser);

    if (!findAllCategorieUser.length) {
      notification
        .setType('ERROR')
        .setMessage('Ops, você não tem categorias')
        .add();

      const data = result
        .setCode(404)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(data);
    }

    return result
      .setCode(200)
      .setData(findAllCategorieUser)
      .setNotification(notification.build())
      .setSuccess(true)
      .build();
  }

  async findAllCategoriesRascunhos(idUser: string) {
    const notification = this.notification();
    const result = this.result();

    if (!idUser) {
      notification
        .setType('ERROR')
        .setMessage('Ops, Seu usuario não foi encontrado')
        .add();

      const data = result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(data);
    }

    const findAllRascunhos = await this.categoryRepo.findAllRascunhos(idUser);

    return result.setData(findAllRascunhos).setSuccess(true).build();
  }

  async deleteCategoryAllTasks(id: string, idUser: string) {
    const notification = this.notification();
    const result = this.result();

    if (!id) {
      notification
        .setType('ERROR')
        .setMessage('Ops, credenciais inválidas')
        .add();
    }

    if (!idUser) {
      notification
        .setType('ERROR')
        .setMessage('Ops, seu usuario não foi encontrado')
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

    const category = await this.categoryRepo.findById(id, idUser);

    if (!category) {
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

    category.deleteAt = new Date();
  }

  async deleteCategoryRascunhos(id: string, idUser: string) {
    const notification = this.notification();
    const result = this.result();

    if (!id) {
      notification
        .setType('ERROR')
        .setMessage('Ops, credenciais inválidas')
        .add();
    }

    if (!idUser) {
      notification
        .setType('ERROR')
        .setMessage('Ops, seu usuario não foi encontrado')
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

    const findCategory = await this.categoryRepo.findById(id, idUser);

    if (!findCategory) {
      notification
        .setType('ERROR')
        .setMessage('Ops, categoria não encontrada')
        .add();

      const data = result
        .setCode(404)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(data);
    }

    const date = new Date();

    findCategory.deleteAt = date;

    try {
      await this.persist.commit();

      notification
        .setType('INFO')
        .setMessage('Opa, Seu rascunho de categoria foi deletada')
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
        .setMessage('Ops, ocorreu um erro ao deletar o rascunho de categoria')
        .add();

      const data = result
        .setCode(500)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(data);
    }
  }

  private async categoryUpdateStatus(
    id: string,
    status: string,
    idUser: string,
  ) {
    const notification = this.notification();
    const result = this.result();

    if (!id) {
      notification
        .setType('ERROR')
        .setMessage('Ops, credenciais inválidas')
        .add();
    }

    if (status && status !== 'Ativa' && status !== 'Inativa') {
      notification
        .setType('WARNING')
        .setMessage('Ops, status inválido para ser atualizado')
        .add();
    }

    if (!idUser) {
      notification
        .setType('ERROR')
        .setMessage('Ops, credenciais inválidas')
        .add();
    }

    if (notification.verifyErrors() || notification.verifyWarnings()) {
      const data = result
        .setCode(400)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(data);
    }

    const findCategory = await this.categoryRepo.findById(id, idUser);

    if (!findCategory) {
      notification
        .setType('ERROR')
        .setMessage('Ops, não encontramos sua categoria')
        .add();

      const data = result
        .setCode(404)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(data);
    }

    findCategory.status = status;
    this.persist.persist(findCategory);

    try {
      await this.persist.commit();

      notification
        .setType('INFO')
        .setMessage('Opa, categoria atualizado')
        .add();

      const data = result
        .setCode(200)
        .setData(findCategory)
        .setNotification(notification.build())
        .setSuccess(true)
        .build();

      return data;
    } catch (e) {
      console.error(e);

      notification
        .setType('ERROR')
        .setMessage('Ops, ocorreu um erro ao atualizar a categoria')
        .add();

      const data = result
        .setCode(500)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(data);
    }
  }

  private async categoryUpdateTitle(title: string, id: string, idUser: string) {
    const notification = this.notification();
    const result = this.result();

    console.log(title, id, idUser);

    if (!id) {
      notification
        .setType('ERROR')
        .setMessage('Ops, credenciais inválidas')
        .add();
    }

    if (!title) {
      notification
        .setType('ERROR')
        .setMessage('Ops, titulo inválido para ser atualizado')
        .add();
    }

    if (!idUser) {
      notification
        .setType('ERROR')
        .setMessage('Ops, credenciais inválidas')
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

    const findCategory = await this.categoryRepo.findById(id, idUser);

    if (!findCategory) {
      notification
        .setType('ERROR')
        .setMessage('Ops, não encontramos sua categoria')
        .add();

      const data = result
        .setCode(404)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(data);
    }

    findCategory.title = title;
    this.persist.persist(findCategory);

    try {
      await this.persist.commit();

      notification
        .setType('INFO')
        .setMessage('Opa, o titulo da sua categoria foi atualizado ')
        .add();

      const data = result
        .setCode(200)
        .setData(findCategory)
        .setNotification(notification.build())
        .setSuccess(true)
        .build();

      return data;
    } catch (e) {
      console.error(e);
      notification
        .setType('ERROR')
        .setMessage('Ops, ocorreu um erro ao atualizar a categoria')
        .add();

      const data = result
        .setCode(500)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(data);
    }
  }

  private async categoryUpdateDescription(
    description: string,
    id: string,
    idUser: string,
  ) {
    const notification = this.notification();
    const result = this.result();

    if (!id) {
      notification
        .setType('ERROR')
        .setMessage('Ops, credenciais inválidas')
        .add();
    }

    if (!description) {
      notification
        .setType('ERROR')
        .setMessage('Ops, title inválido para ser atualizado')
        .add();
    }

    if (!idUser) {
      notification
        .setType('ERROR')
        .setMessage('Ops, credenciais inválidas')
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

    const findCategory = await this.categoryRepo.findById(id, idUser);

    if (!findCategory) {
      notification
        .setType('ERROR')
        .setMessage('Ops, não encontramos sua categoria')
        .add();

      const data = result
        .setCode(404)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(data);
    }

    findCategory.description = description;
    this.persist.persist(findCategory);

    try {
      await this.persist.commit();

      notification
        .setType('INFO')
        .setMessage('Opa, a descrição da sua categoria foi atualizado ')
        .add();

      const data = result
        .setCode(200)
        .setData(findCategory)
        .setNotification(notification.build())
        .setSuccess(true)
        .build();

      return data;
    } catch (e) {
      console.error(e);
      notification
        .setType('ERROR')
        .setMessage('Ops, ocorreu um erro ao atualizar a categoria')
        .add();

      const data = result
        .setCode(500)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(data);
    }
  }

  async updateCategory(
    updateCategory: UpdateCategoryDto,
    idCategory: string,
    idUser: string,
  ) {
    if (updateCategory.titleCategory && idCategory) {
      return await this.categoryUpdateTitle(
        updateCategory?.titleCategory,
        idCategory,
        idUser,
      );
    }

    if (updateCategory.status && idCategory) {
      return await this.categoryUpdateStatus(
        idCategory,
        updateCategory?.status,
        idUser,
      );
    }

    if (updateCategory.descriptionCategory && idCategory) {
      return await this.categoryUpdateDescription(
        updateCategory?.descriptionCategory,
        idCategory,
        idUser,
      );
    }
  }
}

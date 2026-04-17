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
import { UpdateCategoryDto } from '../dto/update-category.dto';

export class CategoryService {
  constructor(
    private readonly notification: () => NotificationBuilderContract,
    private readonly result: () => ResultBuilderContract<Category | Category[]>,
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
    categoryBuilder.setStatus('Ativa');
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

    console.log(categoryBuild.data);

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

    const createdCategory = await this.createCategoryCore(category, findUser);

    if (!createdCategory.success) {
      throw new NotificationException(createdCategory);
    }

    const date = new Date().toISOString();

    const createCategoryRascunho = this.categoryBuilder();
    createCategoryRascunho.generateId();
    createCategoryRascunho.setCategory(category.titleCategory);
    createCategoryRascunho.setDescription(category.descriptionCategory);
    createCategoryRascunho.setUser(findUser);
    createCategoryRascunho.setStatus('Inativa');
    createCategoryRascunho.setCreateDate(date);
    createCategoryRascunho.setUpdateDate(date);
    const createCategoryRascunhoBuild = createCategoryRascunho.build();

    if (!createCategoryRascunhoBuild.success) {
      throw new NotificationException(createCategoryRascunhoBuild);
    }

    console.log(createCategoryRascunhoBuild.data);
    this.categoryRepo.createCategory(createCategoryRascunhoBuild.data);

    try {
      await this.persist.commit();

      notification
        .setType('INFO')
        .setMessage('Opa, sua categoria foi criada')
        .add();

      const data = result
        .setCode(200)
        .setData(createCategoryRascunhoBuild.data)
        .setNotification(notification.build())
        .setSuccess(true)
        .build();

      return data;
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

    const findCategory = await this.categoryRepo.findById(categoryId);

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

    if (findCategory && findCategory.user.id !== idUser) {
      notification
        .setType('ERROR')
        .setMessage('Ops, você não tem permissão para acessar esta categoria')
        .add();
    }

    if (notification.verifyErrors()) {
      const data = result
        .setCode(403)
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

    const category = await this.categoryRepo.findById(id);

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

    category.deleteAt = new Date().toISOString();
    this.persist.persist(category);
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

    const findCategory = await this.categoryRepo.findByIdRascunhos(id, idUser);

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

    if (findCategory.user.id !== idUser) {
      notification
        .setType('ERROR')
        .setMessage('Ops, você não tem permissão para excluir esta categoria')
        .add();

      const data = result
        .setCode(403)
        .setNotification(notification.build())
        .setSuccess(false)
        .build();

      throw new NotificationException(data);
    }

    const date = new Date().toISOString();

    findCategory.deleteAt = date;
    this.persist.persist(findCategory);

    try {
      await this.persist.commit();

      notification
        .setType('INFO')
        .setMessage('Opa, Sua categoria foi deletada')
        .add();

      return result
        .setCode(200)
        .setData(findCategory)
        .setNotification(notification.build())
        .setSuccess(true)
        .build();
    } catch (e) {
      console.error(e);
    }

    notification
      .setType('ERROR')
      .setMessage('Ops, ocorreu um erro ao deletar a categoria')
      .add();

    const data = result
      .setCode(200)
      .setData(findCategory)
      .setNotification(notification.build())
      .setSuccess(true)
      .build();

    throw new NotificationException(data);
  }

  async categoryUpdateStatus(id: string, status: string, idUser: string) {
    const notification = this.notification();
    const result = this.result();

    if (!id) {
      notification
        .setType('ERROR')
        .setMessage('Ops, credenciais inválidas')
        .add();
    }

    if (!status) {
      notification
        .setType('ERROR')
        .setMessage('Ops, status inválido para ser atualizado')
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

    const findCategory = await this.categoryRepo.findById(id);

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

    if (findCategory.user.id !== idUser) {
      notification
        .setType('ERROR')
        .setMessage('Ops, Essa categoria não pertence a se usuário')
        .add();

      const data = result
        .setCode(403)
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

  async categoryUpdateTitle(title: string, id: string, idUser: string) {
    const notification = this.notification();
    const result = this.result();

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

    const findCategory = await this.categoryRepo.findById(id);

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

  async categoryUpdateDescription(
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

    const findCategory = await this.categoryRepo.findById(id);

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
    idTask: string,
    idUser: string,
  ) {
    if (updateCategory.titleCategory && idTask) {
      return await this.categoryUpdateTitle(
        updateCategory?.titleCategory,
        idTask,
        idUser,
      );
    }

    if (updateCategory.status && idTask) {
      return await this.categoryUpdateStatus(
        idTask,
        updateCategory?.status,
        idUser,
      );
    }

    if (updateCategory.descriptionCategory && idTask) {
      return await this.categoryUpdateDescription(
        updateCategory?.descriptionCategory,
        idTask,
        idUser,
      );
    }
  }
}

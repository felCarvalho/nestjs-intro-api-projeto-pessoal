import { EntityRepository } from '@mikro-orm/core';
import { Category } from '../entity/category.entity';
import { CategoryRepositoryContracts } from '../contracts/index.contracts';

export class CategoryRepository
  extends EntityRepository<Category>
  implements CategoryRepositoryContracts<Category>
{
  async findById(id: string) {
    return await this.findOne({ id });
  }

  async findAllId(id: string) {
    return await this.findAll({ where: { id: id } });
  }

  async findAllByUserId(idUser: string) {
    return await this.findAll({ where: { user: { id: idUser } } });
  }

  async findByIds(id: string[]) {
    return await this.find({ id: { $in: id } });
  }

  async findTitle(title: string) {
    return await this.findOne({ title });
  }

  async findByIdRascunhos(id: string, idUser: string) {
    return await this.findOne({ id, user: { id: idUser } });
  }

  async deleteCategory(id: string, idUser: string) {
    return await this.findOne({ id, user: { id: idUser } });
  }

  async findDeletedCategory(): Promise<Category[]> {
    return await this.find({ deleteAt: { $ne: null } });
  }

  async findAllRascunhos(idUser: string) {
    return await this.find(
      {
        user: idUser,
      },
      {
        filters: {
          categoryIsInactive: true,
        },
      },
    );
  }

  createCategory(category: Category) {
    this.create(category);
  }
}

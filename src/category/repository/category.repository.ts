import { EntityRepository } from '@mikro-orm/core';
import { Category } from '../entity/category.entity';
import { CategoryRepositoryContracts } from '../contracts/index.contracts';

export class CategoryRepository
  extends EntityRepository<Category>
  implements CategoryRepositoryContracts<Category>
{
  async findById(id: string, idUser: string) {
    return await this.findOne({ id, user: { id: idUser } });
  }

  async findAllId(id: string, idUser: string) {
    return await this.findAll({ where: { id: id, user: { id: idUser } } });
  }

  async findAllByUserId(idUser: string) {
    return await this.findAll({ where: { user: { id: idUser } } });
  }

  async findByIds(id: string[], idUser: string) {
    return await this.find({ id: { $in: id }, user: { id: idUser } });
  }

  async findTitle(title: string, idUser: string) {
    return await this.findOne({ title, user: { id: idUser } });
  }

  async findDeletedCategory(idUser: string): Promise<Category[]> {
    return await this.find({ deleteAt: { $ne: null }, user: { id: idUser } });
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

import { EntityRepository } from '@mikro-orm/core';
import { Category } from '../entity/category.entity';
import { CategoryRepositoryContracts } from '../contracts/index.contracts';

export class CategoryRepository
  extends EntityRepository<Category>
  implements CategoryRepositoryContracts<Category>
{
  async findById(id: string) {
    return this.findOne({ id });
  }

  async findAllId(id: string) {
    return this.findAll({ where: { id } });
  }

  async findTitle(title: string) {
    return this.findOne({ title });
  }

  createCategory(category: Category) {
    this.create(category);
  }
}

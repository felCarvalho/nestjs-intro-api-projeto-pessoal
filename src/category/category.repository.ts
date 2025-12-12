import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

export class CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  createCategory(category: CreateCategoryDto) {
    const createCategory = this.categoryRepository.create(category);

    return this.categoryRepository.save(createCategory);
  }

  async findAllCategories(idUser: number) {
    const findAllCategories = await this.categoryRepository.find({
      where: { idUser },
    });

    return findAllCategories ? findAllCategories : null;
  }

  async findCategoryById(id: number) {
    const findCategory = await this.categoryRepository.findOneBy({
      id,
    });

    return findCategory ? findCategory : null;
  }

  async updateCategory(id: number, category: UpdateCategoryDto) {
    const updateCategory = await this.categoryRepository.update(id, category);

    return updateCategory.affected ? updateCategory : null;
  }

  async renomearCategory(id: number, category: UpdateCategoryDto) {
    const restoreCategory = await this.categoryRepository.update(id, category);

    return restoreCategory.affected ? restoreCategory : null;
  }

  async deleteCategory(id: number) {
    const deleteCategory = await this.categoryRepository.softDelete(id);

    return deleteCategory.affected ? deleteCategory : null;
  }

  async restoreCategory(id: number) {
    const restoreCategory = await this.categoryRepository.restore(id);

    return restoreCategory.affected ? restoreCategory : null;
  }
}

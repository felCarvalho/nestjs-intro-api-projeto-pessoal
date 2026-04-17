import {
  Controller,
  Post,
  Patch,
  Delete,
  Get,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './service/category.service';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { User } from '../shared/core/@custom-decorators/user-request/user.request';
import { JwtAuthGuard } from '../authentication/auth-guards/auth.jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('home')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('listar-categorias')
  async getCategories(@User() user: { sub: string }) {
    return await this.categoryService.findAllCategories(user.sub);
  }

  @Post('rascunhos/adicionar-categoria')
  async createdCategory(
    @User() user: { sub: string },
    @Body() category: CreateCategoryDto,
  ) {
    return this.categoryService.createCategory(category, user.sub);
  }

  @Patch('rascunhos/atualizar-categoria/:id')
  async updateCategory(
    @User() user: { sub: string },
    @Body() category: UpdateCategoryDto,
    @Param('id') id: string,
  ) {
    return await this.categoryService.updateCategory(category, id, user.sub);
  }

  @Delete('rascunhos/deletar-categoria/:id')
  async deleteCategory(@User() user: { sub: string }, @Param('id') id: string) {
    return await this.categoryService.deleteCategoryRascunhos(id, user.sub);
  }
}

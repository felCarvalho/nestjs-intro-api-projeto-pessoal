import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CategoryService } from './service/category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { User } from '../shared/core/@custom-decorators/user-request/user.request';
import { JwtAuthGuard } from '../authentication/auth-guards/auth.jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('home')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('adicionar-categoria')
  async createdCategory(
    @User() user: { sub: string },
    @Body() category: CreateCategoryDto,
  ) {
    return this.categoryService.createCategory(category, user.sub);
  }
}

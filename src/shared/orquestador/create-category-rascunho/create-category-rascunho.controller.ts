import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateCategoryRascunhoDto } from './create-category-rascunho.dto';
import { User } from '../../../shared/core/@custom-decorators/user-request/user.request';
import { JwtAuthGuard } from '../../../authentication/auth-guards/auth.jwt.guard';
import { CreateCategoryRascunhoOrquestador } from './create-category-rascunho.orquestrador';

@UseGuards(JwtAuthGuard)
@Controller('home/rascunhos')
export class CreateCategoryRascunhoController {
  constructor(
    private readonly createCategoryRascunhoOrquestador: CreateCategoryRascunhoOrquestador,
  ) {}

  @Post('adicionar-categoria-rascunho')
  async createCategoryRascunho(
    @Body() createCategoryDto: CreateCategoryRascunhoDto,
    @User() user: { sub: string },
  ) {
    return await this.createCategoryRascunhoOrquestador.createCategoryRascunho(
      createCategoryDto,
      user.sub,
    );
  }
}

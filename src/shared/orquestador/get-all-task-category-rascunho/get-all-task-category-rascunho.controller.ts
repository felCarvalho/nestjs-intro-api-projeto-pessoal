import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '../../../shared/core/@custom-decorators/user-request/user.request';
import { GetAllTaskCategoryRascunhoOrquestrador } from './get-all-task-category-rascunho..orquestrador';
import { JwtAuthGuard } from '../../../authentication/auth-guards/auth.jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('home')
export class GetAllTaskCategoryRascunhoController {
  constructor(
    private readonly getAllTaskCategoryOrquestrador: GetAllTaskCategoryRascunhoOrquestrador,
  ) {}

  @Get('rascunhos')
  async getAllTaskCategory(@User() user: { sub: string }) {
    return await this.getAllTaskCategoryOrquestrador.getAllTaskCategoryRascunho(
      {
        idUser: user.sub,
      },
    );
  }
}

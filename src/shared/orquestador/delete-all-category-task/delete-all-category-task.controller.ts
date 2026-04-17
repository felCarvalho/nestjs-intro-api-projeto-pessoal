import { Controller, Body, Delete, Param } from '@nestjs/common';
import { User } from '../../core/@custom-decorators/user-request/user.request';
import { JwtAuthGuard } from '../../../authentication/auth-guards/auth.jwt.guard';
import { UseGuards } from '@nestjs/common';
import { DeleteAllCategoryTaskOrquestrador } from './delete-all-category-task.orquestrador';

@UseGuards(JwtAuthGuard)
@Controller('home/categorias')
export class DeleteCategoryTaskOrquestradorController {
  constructor(
    private readonly deleteAllCategoryTaskOrquestrador: DeleteAllCategoryTaskOrquestrador,
  ) {}

  @Delete('deletar-tarefas-categoria/:id')
  async deleteAllTaskCategory(
    @User() user: { sub: string },
    @Param('id') id: string,
  ) {
    return this.deleteAllCategoryTaskOrquestrador.deleteAllCategoryTask(
      id,
      user.sub,
    );
  }
}

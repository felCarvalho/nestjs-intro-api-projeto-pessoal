import { Controller, Patch, Body, Param } from '@nestjs/common';
import { User } from '../../core/@custom-decorators/user-request/user.request';
import { UpdateCategoryTaskOrquestrador } from './update-status-category-task.orquestrador';
import { UpdateCategoryTaskDto } from './update-status-.category-task.dto';
import { JwtAuthGuard } from '../../../authentication/auth-guards/auth.jwt.guard';
import { UseGuards } from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@Controller('home/categorias')
export class UpdateCategoryTaskOrquestradorController {
  constructor(
    private readonly updateCategoryTaskOrquestrador: UpdateCategoryTaskOrquestrador,
  ) {}

  @Patch('atualizar-tarefas/:id')
  async updateTask(
    @User() user: { sub: string },
    @Body() updateDto: UpdateCategoryTaskDto,
    @Param('id') id: string,
  ) {
    return await this.updateCategoryTaskOrquestrador.updateStatusCategoryAndTasks(
      updateDto,
      id,
      user.sub,
    );
  }
}

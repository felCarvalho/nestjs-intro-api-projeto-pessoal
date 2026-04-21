import { Controller, Post, Body, UseGuards } from '@nestjs/common';

import { CreateTaskRascunhoDto } from './create-task-rascunho.dto';
import { User } from '../../../shared/core/@custom-decorators/user-request/user.request';
import { JwtAuthGuard } from '../../../authentication/auth-guards/auth.jwt.guard';
import { CreateTaskRascunhoOrquestador } from './create-task-rascunho.orquestrador';

@UseGuards(JwtAuthGuard)
@Controller('home/rascunhos')
export class CreateTaskRascunhoController {
  constructor(
    private readonly createTaskOrquestador: CreateTaskRascunhoOrquestador,
  ) {}

  @Post('adicionar-tarefa-rascunho')
  async createTasksRascunho(
    @Body() createTaskDto: CreateTaskRascunhoDto,
    @User() user: { sub: string },
  ) {
    return await this.createTaskOrquestador.createTask(createTaskDto, user.sub);
  }
}

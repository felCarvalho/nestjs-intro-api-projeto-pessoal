import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateTaskOrquestador } from './create-task.orquestrador';
import { CreateTaskDto } from './create-task.dto';
import { User } from '../../../shared/core/@custom-decorators/user-request/user.request';
import { JwtAuthGuard } from '../../../authentication/auth-guards/auth.jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('home')
export class CreateTaskController {
  constructor(private readonly createTaskOrquestador: CreateTaskOrquestador) {}

  @Post('adicionar-tarefa')
  async createTasks(
    @Body() createTaskDto: CreateTaskDto,
    @User() user: { sub: string },
  ) {
    return await this.createTaskOrquestador.createTask(createTaskDto, user.sub);
  }
}

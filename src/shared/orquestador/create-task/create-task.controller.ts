import { Controller, Post, Body } from '@nestjs/common';
import { User } from '../../core/@custom-decorators/user-request/user.request';
import { CreateTaskOrquestrador } from './create-task.orquestrador';
import { CreateTaskDto } from './create.dto';
import { JwtAuthGuard } from '../../../authentication/auth-guards/auth.jwt.guard';
import { UseGuards } from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@Controller()
export class CreateTaskOrquestradorController {
  constructor(
    private readonly createTaskOrquestrador: CreateTaskOrquestrador,
  ) {}

  @Post('criar-rotina')
  async createTask(
    @User() user: { sub: string },
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return await this.createTaskOrquestrador.syncCategoryAndTasks(
      createTaskDto,
      user.sub,
    );
  }
}

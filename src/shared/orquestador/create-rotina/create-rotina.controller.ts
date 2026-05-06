import { Controller, Post, Body } from '@nestjs/common';
import { User } from '../../core/@custom-decorators/user-request/user.request';
import { CreateRotinaOrquestrador } from './create-rotina.orquestrador';
import { CreateRotinaDto } from './create-rotina.dto';
import { JwtAuthGuard } from '../../../authentication/auth-guards/auth.jwt.guard';
import { UseGuards } from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@Controller('home')
export class CreateRotinaOrquestradorController {
  constructor(
    private readonly createRotinaOrquestrador: CreateRotinaOrquestrador,
  ) {}

  @Post('criar-rotina')
  async createTask(
    @User() user: { sub: string },
    @Body() createRotinaDto: CreateRotinaDto,
  ) {
    const tasks = await this.createRotinaOrquestrador.createCategoryAndTasks(
      createRotinaDto,
      user.sub,
    );

    return tasks;
  }
}

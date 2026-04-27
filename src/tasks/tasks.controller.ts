import {
  Controller,
  Get,
  Body,
  Param,
  Patch,
  Delete,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './service/task.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../shared/core/@custom-decorators/user-request/user.request';
import { JwtAuthGuard } from '../authentication/auth-guards/auth.jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('home')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getAllTasks(@User() user: { sub: string }) {
    return await this.tasksService.findAllTasks(user.sub);
  }

  @Get('hoje')
  async getTodayTasks(@User() user: { sub: string }) {
    return await this.tasksService.filterTodayTasks(user.sub);
  }

  @Get('semana')
  async getWeekTasks(@User() user: { sub: string }) {
    return await this.tasksService.filterWeekTasks(user.sub);
  }

  @Get('mes')
  async getMonthTasks(@User() user: { sub: string }) {
    return await this.tasksService.filterMonthTasks(user.sub);
  }

  @Get('todos')
  async getAllPeriodTasks(@User() user: { sub: string }) {
    return await this.tasksService.filterAllPeriodTasks(user.sub);
  }

  @Get('detalhes/:id')
  async getTaskById(@Param('id') id: string, @User() user: { sub: string }) {
    return await this.tasksService.findTasks(user.sub, id);
  }

  @Post('buscar/:search')
  async searchTask(
    @User()
    user: {
      sub: string;
    },
    @Param('search') search: string,
  ) {
    const task = await this.tasksService.taskSearch({
      idUser: user.sub,
      search,
    });

    return task;
  }

  @Patch(':id')
  async updateTask(
    @Param('id') id: string,
    @User() user: { sub: string },
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return await this.tasksService.taskUpdate({
      ...updateTaskDto,
      idTask: id,
      idUser: user.sub,
    });
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string, @User() user: { sub: string }) {
    await this.tasksService.deletedTask({ idTask: id, idUser: user.sub });
  }
}

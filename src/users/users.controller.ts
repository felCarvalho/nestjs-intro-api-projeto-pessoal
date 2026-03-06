import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './service/users.service';
import { CreateUserDto } from '../shared/orquestador/create-user/create-user.dto';
import { CreateUserOrquestrador } from '../shared/orquestador/create-user/create-user.orquestrador';

@Controller()
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly createUserOrquestrador: CreateUserOrquestrador,
  ) {}
  @Post('criar-conta')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.createUserOrquestrador.createUser(createUserDto);
  }
}

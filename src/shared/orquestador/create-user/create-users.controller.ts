import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserOrquestrador } from '../../../shared/orquestador/create-user/create-user.orquestrador';
import { CreateUserDto } from './create-user.dto';

@Controller()
export class UserOrquestradoController {
  constructor(
    private readonly createUserOrquestrador: CreateUserOrquestrador,
  ) {}
  @Post('criar-conta')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.createUserOrquestrador.createUser(createUserDto);
  }
}

import {
  ConflictException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUsers(createUserDto: CreateUserDto) {
    const findUsers = await this.usersRepository.findUserNameOrEmail(
      createUserDto.email,
      createUserDto.name,
    );

    if (findUsers) {
      throw new ConflictException('Usuário ou Email já existe');
    }

    const passwordHash = await bcrypt.hash(createUserDto.password, 10);

    const newUser = await this.usersRepository.createUser({
      ...createUserDto,
      password: passwordHash,
    });

    return newUser;
  }

  async updateUsers(publicId: string, user: UpdateUserDto) {
    const { password, ...userDto } = user;

    const passwordHash = password ? await bcrypt.hash(password, 10) : password;

    const updateDto: UpdateUserDto = {
      ...userDto,
    };

    if (passwordHash) {
      updateDto.password = passwordHash;
    }

    const updateUser = await this.usersRepository.updateUser(
      publicId,
      updateDto,
    );

    if (!updateUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return {
      message: 'Usuario atualizado com sucesso',
      user: user,
    };
  }

  async deleteUsers(id: number) {
    const deleteUser = await this.usersRepository.deleteUser(id);

    if (!deleteUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const user = await this.usersRepository.findUsersById(id);

    return { message: 'Usuário deletado com sucesso', userDeleted: user };
  }

  async findUsers(email: string) {
    const users = await this.usersRepository.findUserByEmail(email);

    if (!users) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return users;
  }
}

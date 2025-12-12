import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(user: CreateUserDto) {
    const newUser = this.userRepository.create(user);

    return await this.userRepository.save(newUser);
  }

  async findUsersById(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    return user ? user : null;
  }
  async findUsersByPublicId(publicId: string) {
    const user = await this.userRepository.findOneBy({ publicId });

    return user ? user : null;
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });

    return user ? user : null;
  }

  async findUserNameOrEmail(name: string, email: string) {
    const user = await this.userRepository.exists({
      where: [{ name }, { email }],
    });

    return user;
  }

  async updateUser(publicId: string, user: UpdateUserDto) {
    const findUpdateUser = await this.userRepository.update(publicId, user);

    return findUpdateUser?.affected ? findUpdateUser : null;
  }

  async deleteUser(id: number) {
    const findDeleteUser = await this.userRepository.softDelete(id);

    return findDeleteUser?.affected ? findDeleteUser : null;
  }
}

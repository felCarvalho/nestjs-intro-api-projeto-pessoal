import { User } from '../entity/user.entity';
import { UserRepositoryContract } from '../contracts/index.contract';
import { EntityRepository } from '@mikro-orm/postgresql';

export class UserRepository
  extends EntityRepository<User>
  implements UserRepositoryContract<User>
{
  async findById(id: string) {
    return await this.findOne({ id });
  }

  async findAllId(id: string) {
    return await this.findAll({
      where: { id },
    });
  }

  createUser(data: User) {
    return this.create(data);
  }

  async findName(name: string) {
    return this.findOne({ name });
  }
}

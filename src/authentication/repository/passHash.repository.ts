import { PassHash } from '../entities/passHash.entity';
import { EntityRepository } from '@mikro-orm/core';
import { PassHashRepositoryContract } from '../contracts/passHash.contract';

export class PassHashRepository
  extends EntityRepository<PassHash>
  implements PassHashRepositoryContract<PassHash>
{
  async findById(id: string) {
    return await this.findOne({ id }, { populate: ['user'] });
  }

  async findAllId(id: string) {
    return await this.findAll({ where: id });
  }

  async findUserById(id: string) {
    return await this.findOne({ user: { id } }, { populate: ['user'] });
  }

  createPassHash(passHash: PassHash) {
    this.create(passHash);
  }
}

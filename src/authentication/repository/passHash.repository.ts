import { PassHash } from '../entities/passHash.entity';
import { EntityRepository } from '@mikro-orm/core';
import { PassHashRepositoryContract } from '../contracts/passHash.contract';

export class PassHashRepository
  extends EntityRepository<PassHash>
  implements PassHashRepositoryContract<PassHash>
{
  async findById(id: string, idUser: string) {
    return await this.findOne(
      { id, user: { id: idUser } },
      { populate: ['user'] },
    );
  }

  async findAllId(id: string, idUser: string) {
    return await this.findAll({ where: { id, user: { id: idUser } } });
  }

  async findUserById(idUser: string) {
    return await this.findOne({ user: { id: idUser } }, { populate: ['user'] });
  }

  createPassHash(passHash: PassHash) {
    this.create(passHash);
  }
}

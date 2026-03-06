import { CredentialsRepositoryContract } from '../contracts/credentials.contracts';
import { Credentials } from '../entities/credentials.entity';
import { EntityRepository } from '@mikro-orm/core';

export class CredentialsRepository
  extends EntityRepository<Credentials>
  implements CredentialsRepositoryContract<Credentials>
{
  async findById(id: string) {
    return await this.findOne({ id }, { populate: ['user'] });
  }

  async findAllId(id: string) {
    return await this.findAll({ where: id });
  }

  createCredentials(credentials: Credentials) {
    return this.create(credentials);
  }

  async findIdentifier(identifier: string) {
    return this.findOne({ identifier });
  }

  async findUserById(id: string) {
    return await this.findOne({ user: id });
  }
}

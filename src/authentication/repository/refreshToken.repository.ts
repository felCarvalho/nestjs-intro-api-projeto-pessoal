import { RefreshToken } from '../entities/refreshToken.entity';
import { EntityRepository } from '@mikro-orm/core';
import { RefreshTokenRepositoryContract } from '../contracts/refreshToken.contracts';

export class RefreshTokenRepository
  extends EntityRepository<RefreshToken>
  implements RefreshTokenRepositoryContract<RefreshToken>
{
  async findById(id: string) {
    return await this.findOne({ id });
  }

  async findAllId(id: string) {
    return await this.findAll({ where: id });
  }

  createRefreshToken(refreshToken: RefreshToken) {
    this.create(refreshToken);
  }

  async findUserById(id: string) {
    return await this.findOne({ user: id });
  }
}

import { RefreshToken } from '../entities/refreshToken.entity';
import { EntityRepository } from '@mikro-orm/core';
import { RefreshTokenRepositoryContract } from '../contracts/refreshToken.contracts';

export class RefreshTokenRepository
  extends EntityRepository<RefreshToken>
  implements RefreshTokenRepositoryContract<RefreshToken>
{
  async findById(id: string, idUser: string) {
    return await this.findOne({ id, user: idUser });
  }

  async findAllId(id: string, idUser: string) {
    return await this.findAll({ where: { id, user: idUser } });
  }

  createRefreshToken(refreshToken: RefreshToken) {
    this.create(refreshToken);
  }

  async findUserById(idUser: string) {
    return await this.findOne({ user: idUser });
  }
}

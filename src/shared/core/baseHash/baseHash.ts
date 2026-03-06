import { ConfigService } from '@nestjs/config';
import { HashContract } from '../contracts/contracts.hash';
import * as bcrypt from 'bcrypt';
import { NotificationBuilderContract } from '../contracts/contracts.notification';

abstract class DataHash {
  abstract hash: string;
}

export class BaseHash implements HashContract {
  protected data: Partial<DataHash>;

  constructor(
    private readonly encrypt: typeof bcrypt,
    private readonly configService: ConfigService,
    protected notification: NotificationBuilderContract,
    protected entity: Partial<DataHash>,
  ) {
    this.data = entity;
  }

  async setHash(password: string) {
    const hash = await this.encrypt.hash(
      password,
      Number(await this.configService.getOrThrow('SALTOS_HASH')),
    );

    if (!hash) {
      this.notification
        .setType('ERROR')
        .setMessage('Ops! O hash não foi gerado')
        .add();
    }

    this.data.hash = hash;
    return this;
  }

  async setCompare(password: string, hash: string) {
    const compare = await this.encrypt.compare(password, hash);

    console.log(compare);

    if (!compare) {
      this.notification
        .setType('ERROR')
        .setMessage('Ops! Seu hash não confere')
        .add();
    }

    return compare;
  }
}

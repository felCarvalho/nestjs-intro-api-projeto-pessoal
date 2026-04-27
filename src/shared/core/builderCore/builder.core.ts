import { v4 as uuidv4 } from 'uuid';
import { NotificationBuilderContract } from '../contracts/contracts.notification';
import { BuilderCoreContract } from '../contracts/contracts.builder.core';
import { BuilderCoreDataContract } from '../contracts/contracts.builder.core';

export class BuilderCore implements BuilderCoreContract {
  protected notification: NotificationBuilderContract;
  protected data: Partial<BuilderCoreDataContract>;

  constructor(
    notification: NotificationBuilderContract,
    entity: Partial<BuilderCoreDataContract>,
  ) {
    this.notification = notification;
    this.data = entity;
  }

  generateId() {
    const id = uuidv4();

    if (!id) {
      this.notification
        .setType('ERROR')
        .setMessage('Ops! não foi possivel gerar o seu id')
        .add();
    }

    this.data.id = id;
    return this;
  }

  setCreateDate(date: Date) {
    this.data.createAt = date;
    return this;
  }

  setUpdateDate(date: Date) {
    this.data.updateAt = date;
    return this;
  }

  setDeleteDate(date: Date | null) {
    this.data.deleteAt = date;
    return this;
  }
}

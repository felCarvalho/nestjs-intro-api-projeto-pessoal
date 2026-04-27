import { Category } from '../entity/category.entity';
import { CategoryBuilderContracts } from '../contracts/index.contracts';
import { NotificationBuilderContract } from '../../shared/core/contracts/contracts.notification';
import { ResultBuilderContract } from '../../shared/core/contracts/contracts.result';
import { User } from '../../users/entity/user.entity';
import { BuilderCore } from '../../shared/core/builderCore/builder.core';

export class CategoryBuilder
  extends BuilderCore
  implements CategoryBuilderContracts<Category>
{
  protected category: Category;
  protected notification: NotificationBuilderContract;
  protected result: ResultBuilderContract<Category>;

  constructor(
    result: ResultBuilderContract<Category>,
    notification: NotificationBuilderContract,
    category: Category = new Category(),
  ) {
    super(notification, category);
    this.category = category;
    this.notification = notification;
    this.result = result;
  }

  setCategory(category: string) {
    if (!category) {
      this.notification
        .setType('ERROR')
        .setMessage('Ops! erro ao validar a categoria')
        .add();
    }
    this.category.title = category;
    return this;
  }

  setDescription(description: string) {
    this.category.description = description;
    return this;
  }

  setStatus(status: 'Ativa' | 'Inativa') {
    if (!status) {
      this.notification
        .setType('ERROR')
        .setMessage('Ops! erro ao validar o status')
        .add();
    }

    this.category.status = status;
    return this;
  }

  setUser(user: User) {
    if (!user) {
      this.notification
        .setType('ERROR')
        .setMessage('Ops! erro ao validar id do usuário')
        .add();
    }
    this.category.user = user;
    return this;
  }

  build() {
    const notification = this.notification;
    const result = this.result;

    if (notification.verifyErrors()) {
      result.setNotification(notification.build());
      result.setSuccess(false);

      return result.build();
    }

    result.setNotification(notification.build());
    result.setData(this.category);
    result.setSuccess(true);

    return result.build();
  }
}

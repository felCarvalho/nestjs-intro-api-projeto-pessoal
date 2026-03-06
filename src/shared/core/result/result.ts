import { NotificationContract } from '../contracts/contracts.notification';
import {
  ResultContract,
  ResultBuilderContract,
} from '../contracts/contracts.result';

export class ResultData<T> implements ResultContract<T> {
  public data: T;
  public success = false;
  public notification: NotificationContract[] = [];
  public code: number;
}

export class ResultBuilder<T> implements ResultBuilderContract<T> {
  protected result: ResultData<T>;

  constructor() {
    this.result = new ResultData();
  }

  setData(data: T) {
    this.result.data = data;
    return this;
  }

  setSuccess(success: boolean) {
    this.result.success = success;
    return this;
  }

  setNotification(notification: NotificationContract[]) {
    this.result.notification = notification;
    return this;
  }

  setCode(code: number) {
    this.result.code = code;
    return this;
  }

  build() {
    return this.result;
  }
}

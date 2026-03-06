import { ResultData } from '../result/result';
import { NotificationContract } from './contracts.notification';

export abstract class ResultContract<T> {
  abstract data: T;
  abstract success: boolean;
  abstract notification: NotificationContract[];
  abstract code: number;
}

export abstract class ResultBuilderContract<T> {
  abstract setData(data: T): this;
  abstract setSuccess(success: boolean): this;
  abstract setNotification(notification: NotificationContract[]): this;
  abstract setCode(code: number): this;
  abstract build(): ResultData<T>;
}

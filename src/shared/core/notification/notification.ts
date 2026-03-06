import {
  NotificationContract,
  NotificationBuilderContract,
} from '../contracts/contracts.notification';

export class NotificationData implements NotificationContract {
  code: number;
  message: string = '';
  type: 'ERROR' | 'WARNING' | 'INFO' = 'INFO';
}

export class NotificationBuilder implements NotificationBuilderContract {
  protected notification: NotificationContract[] = [];
  protected notificationCurrent: NotificationContract;

  constructor() {
    this.notificationCurrent = new NotificationData();
  }

  setType(type: 'ERROR' | 'WARNING' | 'INFO') {
    this.notificationCurrent.type = type;
    return this;
  }

  setMessage(message: string) {
    this.notificationCurrent.message = message;
    return this;
  }

  add() {
    this.notification.push({ ...this.notificationCurrent });
    this.notificationCurrent = new NotificationData();
    return this;
  }

  clearNotification() {
    this.notification = [];
    return this;
  }

  findCode(code: number) {
    return this.notification.find((n) => n.code === code);
  }

  verifyErrors() {
    return this.notification.some((n) => n.type === 'ERROR');
  }

  verifyWarnings() {
    return this.notification.some((n) => n.type === 'WARNING');
  }

  verifyInfo() {
    return this.notification.some((n) => n.type === 'INFO');
  }

  setCode(code: number) {
    this.notificationCurrent.code = code;
    return this;
  }

  build() {
    return this.notification;
  }
}

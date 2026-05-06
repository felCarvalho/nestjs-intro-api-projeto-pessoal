export abstract class NotificationContract {
  abstract type: 'ERROR' | 'WARNING' | 'INFO';
  abstract key?: string;
  abstract message: string;
  abstract code: number;
}

export abstract class NotificationBuilderContract {
  abstract setType(type: 'ERROR' | 'WARNING' | 'INFO'): this;
  abstract setMessage(message: string): this;
  abstract add(): this;
  abstract clearNotification(): this;
  abstract verifyErrors(): boolean;
  abstract verifyWarnings(): boolean;
  abstract verifyInfo(): boolean;
  abstract setCode(code: number): this;
  abstract setKey(key: string): this;
  abstract findCode(code: number): NotificationContract | undefined;
  abstract build(): NotificationContract[];
}

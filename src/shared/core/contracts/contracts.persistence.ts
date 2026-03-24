export abstract class PersistContract<T> {
  abstract commit(): Promise<void>;
  abstract persist(data: T): void;
  abstract remove(data: T | T[]): void;
  abstract fromObject(data: T): T;
}

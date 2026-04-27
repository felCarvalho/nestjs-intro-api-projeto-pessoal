export abstract class BuilderCoreDataContract {
  abstract id: string;
  abstract createAt: Date;
  abstract updateAt: Date;
  abstract deleteAt: Date | null;
}

export abstract class BuilderCoreContract {
  abstract generateId(): this;
  abstract setCreateDate(date: Date): this;
  abstract setUpdateDate(date: Date): this;
  abstract setDeleteDate(date: Date | null): this;
}

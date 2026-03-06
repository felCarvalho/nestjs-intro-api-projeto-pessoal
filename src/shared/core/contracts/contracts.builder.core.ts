export abstract class BuilderCoreDataContract {
  abstract id: string;
  abstract createAt: string;
  abstract updateAt: string;
  abstract deleteAt: string | null;
}

export abstract class BuilderCoreContract {
  abstract generateId(id: string): this;
  abstract setCreateDate(date: string): this;
  abstract setUpdateDate(date: string): this;
  abstract setDeleteDate(date: string): this;
}

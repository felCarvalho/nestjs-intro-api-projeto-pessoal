import { ResultContract } from 'src/shared/core/contracts/contracts.result';
import { ICategory, IUser } from '../../shared/core/types/types';

export abstract class CategoryRepositoryContracts<T> {
  abstract findById(id: string, idUser: string): Promise<T | null>;
  abstract findAllId(id: string, idUser: string): Promise<T[]>;
  abstract findTitle(
    title: string,
    idUser: string,
    status: string,
  ): Promise<T | null>;
  abstract createCategory(category: ICategory): void;
  abstract findByIds(id: string[], idUser: string): Promise<T[]>;
  abstract findAllByUserId(idUser: string): Promise<T[]>;
  abstract findAllRascunhos(idUser: string): Promise<T[]>;
}

export abstract class CategoryBuilderContracts<T> {
  abstract setCategory(category: string): this;
  abstract build(): ResultContract<T>;
  abstract setUser(user: IUser): this;
  abstract setCreateDate(date: string): this;
  abstract generateId(): this;
  abstract setDescription(description: string): this;
  abstract setStatus(status: 'Ativa' | 'Inativa'): this;
  abstract setUpdateDate(date: string): this;
  abstract setDeleteDate(date: string): this;
}

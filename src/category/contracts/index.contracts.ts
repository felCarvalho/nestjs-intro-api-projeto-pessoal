import { ResultContract } from 'src/shared/core/contracts/contracts.result';
import { User } from '../../users/entity/user.entity';
import { Category } from '../entity/category.entity';

export abstract class CategoryRepositoryContracts<T> {
  abstract findById(id: string, idUser: string): Promise<T | null>;
  abstract findAllId(id: string, idUser: string): Promise<T[]>;
  abstract findTitle(title: string, idUser: string): Promise<T | null>;
  abstract createCategory(category: Category): void;
  abstract findByIds(id: string[], idUser: string): Promise<T[]>;
  abstract findAllByUserId(idUser: string): Promise<T[]>;
  abstract findAllRascunhos(idUser: string): Promise<T[]>;
}

export abstract class CategoryBuilderContracts<T> {
  abstract setCategory(category: string): this;
  abstract build(): ResultContract<T>;
  abstract setUser(user: User): this;
  abstract setCreateDate(date: Date): this;
  abstract generateId(): this;
  abstract setDescription(description: string): this;
  abstract setStatus(status: 'Ativa' | 'Inativa'): this;
  abstract setUpdateDate(date: Date): this;
  abstract setDeleteDate(date: Date | null): this;
}

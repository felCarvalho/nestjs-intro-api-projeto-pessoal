import { ICategory, IUser } from '../../shared/core/types/types';
import { baseEntity } from '../../shared/core/baseEntity/base.schema';

export class Tasks extends baseEntity {
  title: string;
  description: string;
  completed: string;
  category: ICategory;
  user: IUser;
}

import { baseEntity } from '../../shared/core/baseEntity/base.schema';
import { IUser } from '../../shared/core/types/types';

export class Category extends baseEntity {
  title: string;
  description: string;
  user: IUser;
}

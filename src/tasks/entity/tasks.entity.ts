import { Category } from '../../category/entity/category.entity';
import { User } from '../../users/entity/user.entity';
import { baseEntity } from '../../shared/core/baseEntity/base.schema';

export class Tasks extends baseEntity {
  title: string;
  description: string;
  completed: string;
  category!: Category;
  user!: User;
  status: string;
}

import { baseEntity } from '../../shared/core/baseEntity/base.schema';
import { User } from '../../users/entity/user.entity';

export class Category extends baseEntity {
  title: string;
  description: string;
  user: User;
  status: string;
}

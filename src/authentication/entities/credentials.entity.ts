import { baseEntity } from '../../shared/core/baseEntity/base.schema';
import { User } from '../../users/entity/user.entity';

export class Credentials extends baseEntity {
  identifier: string = '';
  provider: string = '';
  user: User;
}

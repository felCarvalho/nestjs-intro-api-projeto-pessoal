import { baseEntity } from '../../shared/core/baseEntity/base.schema';
import { User } from '../../users/entity/user.entity';

export class RefreshToken extends baseEntity {
  hash: string = '';
  status: string = '';
  user: User;
}

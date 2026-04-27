import { baseEntity } from '../../shared/core/baseEntity/base.schema';
import { User } from '../../users/entity/user.entity';

export class PassHash extends baseEntity {
  hash: string = '';
  user: User;
}

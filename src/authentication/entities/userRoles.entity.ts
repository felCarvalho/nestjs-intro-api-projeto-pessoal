import { User } from '../../users/entity/user.entity';
import { Roles } from '../../authentication/entities/roles.entity';

export class UserRoles {
  user: User;
  role: Roles;
  createAt: Date = new Date();
  deleteAt: Date | null = null;
  updateAt: Date = new Date();
}

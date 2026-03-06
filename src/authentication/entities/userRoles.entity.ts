import { IUser } from '../../shared/core/types/types';
import { IRoles } from '../../shared/core/types/types';

export class UserRoles {
  user: IUser;
  role: IRoles;
  createAt: string = new Date().toISOString();
  deleteAt: string | null = null;
  updateAt: string = new Date().toISOString();
}

import { Roles } from '../../authentication/entities/roles.entity';
import { Permissions } from './permissions.entity';

export class RolesPermissions {
  role: Roles;
  permission: Permissions;
  createAt: string = new Date().toISOString();
  deleteAt: string | null = null;
  updateAt: string = new Date().toISOString();
}

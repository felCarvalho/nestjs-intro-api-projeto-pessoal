import { IRoles } from 'src/shared/core/types/types';
import { IPermissions } from '../../shared/core/types/types';

export class RolesPermissions {
  role: IRoles;
  permission: IPermissions;
  createAt: string = new Date().toISOString();
  deleteAt: string | null = null;
  updateAt: string = new Date().toISOString();
}

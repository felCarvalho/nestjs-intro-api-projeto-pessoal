import { baseEntity } from '../../shared/core/baseEntity/base.schema';
import { IUser } from '../../shared/core/types/types';

export class Credentials extends baseEntity {
  identifier: string = '';
  provider: string = '';
  user: IUser;
}

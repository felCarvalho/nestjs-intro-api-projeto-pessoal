import { baseEntity } from '../../shared/core/baseEntity/base.schema';
import { IUser } from '../../shared/core/types/types';

export class PassHash extends baseEntity {
  hash: string = '';
  user: IUser;
}

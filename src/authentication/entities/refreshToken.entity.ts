import { baseEntity } from '../../shared/core/baseEntity/base.schema';

export class RefreshToken extends baseEntity {
  hash: string = '';
  status: string = '';
  user: string = '';
}

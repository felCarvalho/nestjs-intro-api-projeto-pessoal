import { HttpException, HttpStatus } from '@nestjs/common';

interface data {
  data: any;
  success: boolean;
  notification: any;
  code: number;
}

export class NotificationException extends HttpException {
  constructor(result: data) {
    if (!result.data) {
      const { data, ...resultException } = result;
      super(
        HttpException.createBody({ ...resultException }),
        resultException.code || HttpStatus.BAD_REQUEST,
      );
    } else {
      super(
        HttpException.createBody({ ...result }),
        result.code || HttpStatus.BAD_REQUEST,
      );
    }
  }
}

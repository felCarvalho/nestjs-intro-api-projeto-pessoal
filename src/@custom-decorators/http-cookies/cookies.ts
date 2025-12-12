import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { getCookieFromRequest } from '../../shared/cookies.helper';

export const Cookies = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return data && getCookieFromRequest(request, data);
  },
);

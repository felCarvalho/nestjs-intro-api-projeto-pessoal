import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UAParser } from 'ua-parser-js';
import * as express from 'express';

export interface userAgent {
  browser: string;
  userAgentString: string;
}

export const UserAgent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<express.Request>();
    const userAgent = request.headers['user-agent'];

    if (!userAgent) {
      throw new Error('user-agent não encontrado');
    }

    const parser = new UAParser();
    parser.setUA(userAgent);

    const info = parser.getResult();

    return {
      browser: info.browser.name,
      userAgentString: info.ua,
    } as userAgent;
  },
);

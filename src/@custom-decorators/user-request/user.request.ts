import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user;

    // Se o usuário passou um argumento (ex: @User('email')), retorna só aquele campo
    // Caso contrário, retorna o objeto user inteiro
    return data ? (user as Record<string, unknown>)?.[data] : user;
  },
);

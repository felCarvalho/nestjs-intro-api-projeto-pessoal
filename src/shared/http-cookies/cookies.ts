import * as express from 'express';

export function extractJwtFromRequest(req: express.Request): string | null {
  if (req.cookies && req.cookies['accessToken']) {
    return req.cookies['accessToken'] as string;
  } else {
    return null;
  }
}

export function extractRefreshTokenFromRequest(
  req: express.Request,
): string | null {
  if (req.cookies && req.cookies['refreshToken']) {
    return req.cookies['refreshToken'] as string;
  } else {
    return null;
  }
}

//não use caso esteja usando SSR
// obs: mais eficaz envia do SSR para o browser
/*export function setCookie<T>(
  res: express.Response,
  name: string,
  value: T,
  maxAge: number,
  secure: boolean,
) {
  res.cookie(name, value, {
    httpOnly: true,
    secure: secure,
    sameSite: 'lax',
    maxAge: maxAge,
  });
  }*/

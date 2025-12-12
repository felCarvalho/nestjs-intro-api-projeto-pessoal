import * as express from 'express';

export const getCookieFromRequest = (
  req: express.Request,
  key: string,
): string => {
  const cookie = key && (req.cookies as Record<string, string>)[key];

  return cookie;
};

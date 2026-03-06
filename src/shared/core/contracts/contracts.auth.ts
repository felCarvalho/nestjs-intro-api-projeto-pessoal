export abstract class payload {
  role: string;
  sub: string;
  identifier: string;
  username: string;
  idToken: string;
  exp: number;
  iat: number;
}

export abstract class BaseAuthContract {
  abstract generateToken(payload: Partial<payload>): Promise<string>;
  abstract verifyToken(token: string): Promise<payload | null>;
  abstract decodeToken(token: string): Promise<payload | null>;
  abstract generateRefreshToken(payload: Partial<payload>): Promise<string>;
}

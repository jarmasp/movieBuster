export class TokenPayload {
  username: string;

  sub: string;

  iat: number;

  exp: number;

  jti?: string;
}

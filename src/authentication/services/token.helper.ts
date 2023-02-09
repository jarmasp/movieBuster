import { Request } from 'express';

export function getBearer(req: Request): string {
  return req.headers.authorization.split(' ')[1];
}

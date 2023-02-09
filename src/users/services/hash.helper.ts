import { hashSync } from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HashHelper {
  hash(password: string): string {
    return hashSync(password, 10);
  }
}

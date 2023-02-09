import { Exclude } from '@nestjs/class-transformer';

export class SerializedUser {
  userId: string;

  name: string;

  lastname: string;

  email: string;

  @Exclude()
  password: string;

  createdAt: Date;

  updatedAt: Date;

  constructor(partial: Partial<SerializedUser>) {
    Object.assign(this, partial);
  }
}

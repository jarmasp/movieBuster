import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class AccessToken {
  @PrimaryColumn()
  jti: string;

  @Column()
  userId: string;
}

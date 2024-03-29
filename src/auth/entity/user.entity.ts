import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exchange } from '../../exchange/entity/exchange.entity';
import { UserInfo } from '../../user/entity/user-info.entity';
import { Exclude } from 'class-transformer';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  constructor() {
    // Call the super() constructor from BaseEntity
    super();
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  username: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column()
  salt: string;

  @Column({ nullable: true })
  @Exclude()
  public hashedRefreshToken?: string;

  @Column({ nullable: true })
  twoFactorAuthSecret?: string;

  @Column({ default: false })
  public isTwoFactorEnable: boolean;

  @OneToMany((type) => Exchange, (exchange) => exchange.user, { eager: true })
  exchange: Exchange[];

  @OneToOne((type) => UserInfo, { eager: true })
  @JoinColumn()
  user_info: UserInfo;

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt
      .compare(password, hashedPassword)
      .then((result) => result);
  }
}

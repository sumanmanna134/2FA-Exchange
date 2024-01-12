import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from '../repository/user.repository';
import * as config from 'config';
import { JwtPayload } from '../../interfaces/jwt-payload.interface';
import { User } from '../entity/user.entity';
const dbConfig = config.get('jwt');
@Injectable()
export class JwtTwoFaStrategy extends PassportStrategy(
  Strategy,
  'jwt-two-factor',
) {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET || dbConfig.secret,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload;
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException();
    }

    if (!user.isTwoFactorEnable) {
      return user;
    }

    if (payload.isTwoFaAuthenticated) {
      return user;
    }
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from '../repository/user.repository';
import * as config from 'config';
import { JwtPayload } from '../../interfaces/jwt-payload.interface';
const dbConfig = config.get('jwt');
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken,
      secretOrKey:
        process.env.JWT_REFRESH_TOKEN_SECRET || dbConfig.refreshSecret,
    });
  }

  async validate(payload: JwtPayload) {
    const { username, isTwoFaAuthenticated } = payload;
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user || (user.isTwoFactorEnable && !isTwoFaAuthenticated)) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

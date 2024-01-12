import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as config from 'config';
import { UserRepository } from '../repository/user.repository';
import { AuthService } from './auth.service';
import { User } from '../entity/user.entity';
import { Response } from 'express';
// @ts-ignore
import { authenticator } from 'otplib';
// // @ts-ignore
// import { toFileStream } from 'qrcode';
import { SignInPayLoadInterFaceOptions } from '../../interfaces/signIn.payload.interface';
import { toFileStream } from 'qrcode';

const dbConfig = config.get('jwt');
@Injectable()
export class TwoFactorAuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private authService: AuthService,
  ) {}
  public async generateTwoFactorAuthSecret(user: User) {
    const auth = await this.userRepository.getUserInfoByUsername(user.username);
    if (auth) {
      if (auth.isTwoFactorEnable) {
        throw new BadRequestException('Already QR generated');
      }
    }
    const secret = authenticator.generateSecret();
    const app_name =
      process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME ||
      dbConfig.twoFactorAppName;
    const optAuthUrl = authenticator.keyuri(user.username, app_name, secret);
    await this.userRepository.update(
      { username: user.username },
      { twoFactorAuthSecret: secret },
    );

    return {
      secret,
      optAuthUrl,
    };
  }

  public async qrCodeStreamPipe(stream: Response, optPathUrl: string) {
    return toFileStream(stream, optPathUrl);
  }

  public async activationOfTwoFa(email: string, status: boolean) {
    return await this.userRepository.update(
      { username: email },
      { isTwoFactorEnable: status },
    );
  }

  public async verifyTwoFaCode(code: string, user: User) {
    return authenticator.verify({
      token: code,
      secret: user.twoFactorAuthSecret,
    });
  }

  async signIn(
    user: User,
    isTwoFaAuthenticated: boolean,
  ): Promise<SignInPayLoadInterFaceOptions> {
    const data = {
      isTwoFaAuthenticated,
      isTwoFactorEnable: user.isTwoFactorEnable,
      username: user.username,
      user_info: user.user_info,
    };

    const accessToken = await this.authService.getAccessToken(data);
    const refreshToken = await this.authService.getRefreshToken(data);
    await this.authService.updateRefreshTokenInUser(
      refreshToken,
      user.username,
    );
    return {
      accessToken,
      refreshToken,
      user: {
        username: user.username,
        user_info: user.user_info,
      },
    };
  }
}

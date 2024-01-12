import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserRepository } from '../repository/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupCredentialsDto } from '../dto/signup-credentials.dto';
import { SignUpResponseDto } from '../../utils/interfaces/common.type';
import { SignInCredentialsDto } from '../dto/signin-credentials.dto';
import { SignInPayLoadInterFaceOptions } from '../../interfaces/signIn.payload.interface';
import { JwtPayload } from '../../interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import * as config from 'config';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcrypt';

const dbConfig = config.get('jwt');
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async getNewAccessAndRefreshToken(payload: JwtPayload) {
    const refreshToken = await this.getRefreshToken(payload);
    await this.updateRefreshTokenInUser(refreshToken, payload.username);
    return {
      accessToken: await this.getAccessToken(payload),
      refreshToken: refreshToken,
    };
  }

  async signup(
    signUpCredentialDto: SignupCredentialsDto,
  ): Promise<SignUpResponseDto> {
    return this.userRepository.signup(signUpCredentialDto);
  }

  async signIn(
    signInCredentialDto: SignInCredentialsDto,
  ): Promise<SignInPayLoadInterFaceOptions> {
    const resp = await this.userRepository.validateUserPassword(
      signInCredentialDto,
    );
    if (!resp) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const accessToken = await this.getAccessToken(resp);
    if (resp.isTwoFactorEnable) {
      return {
        accessToken,
      };
    }

    const refreshToken = await this.getRefreshToken(resp);
    await this.updateRefreshTokenInUser(refreshToken, resp.username);
    return {
      accessToken,
      refreshToken,
      user: resp,
    };
  }

  async signOut(user: User) {
    await this.updateRefreshTokenInUser(null, user.username);
  }

  async getAccessToken(payload: JwtPayload) {
    const accessToken = await this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET || dbConfig.secret,
      expiresIn:
        +process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME || dbConfig.expiresIn,
    });

    return accessToken;
  }

  async getRefreshToken(payload: JwtPayload) {
    const refreshToken = await this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET || dbConfig.refreshSecret,
      expiresIn:
        +process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME ||
        dbConfig.refreshExpiresIn,
    });

    return refreshToken;
  }

  async updateRefreshTokenInUser(refreshToken, username) {
    if (refreshToken) {
      refreshToken = await bcrypt.hash(refreshToken, 10);
    }

    await this.userRepository.update(
      { username: username },
      {
        hashedRefreshToken: refreshToken,
      },
    );
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    username: string,
  ): Promise<User> {
    const user = await this.userRepository.getUserInfoByUsername(username);
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      await this.updateRefreshTokenInUser(null, username);
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }
}

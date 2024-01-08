import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { SignupCredentialsDto } from '../dto/signup-credentials.dto';
import { CommonPromiseInterface } from '../../utils/interfaces/common.type';
import * as bcrypt from 'bcrypt';
import { UserInfo } from '../../user/entity/user-info.entity';
import { SignInCredentialsDto } from '../dto/signin-credentials.dto';
import { JwtPayload } from '../../interfaces/jwt-payload.interface';

@Injectable()
export class UserRepository extends Repository<User> {
  async signup(
    signupCredentialsDto: SignupCredentialsDto,
  ): Promise<CommonPromiseInterface> {
    const user = await this.createUser(signupCredentialsDto);
    try {
      await this.saveUserToDatabase(user);
      return { message: 'User successfully created!' };
    } catch (error) {
      this.handleSignUpError(error);
    }
  }

  private async createUser(
    signupCredentialsDto: SignupCredentialsDto,
  ): Promise<User> {
    const { username, password } = signupCredentialsDto;
    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.user_info = await this.setUserInfo();
    return user;
  }

  private async saveUserToDatabase(user: User): Promise<void> {
    try {
      await user.save();
    } catch (error) {
      throw new InternalServerErrorException('Error creating User');
    }
  }

  private handleSignUpError(error: any): never {
    if (error.code === '23505') {
      throw new ConflictException('Username already exists');
    } else {
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async validateUserPassword(
    signInCredentialDto: SignInCredentialsDto,
  ): Promise<JwtPayload> {
    const { username, password } = signInCredentialDto;
    const auth = await this.findOne({ where: { username: username } });
    if (auth && (await auth.validatePassword(password, auth.password))) {
      return {
        isTwoFactorEnable: auth.isTwoFactorEnable,
        username: auth.username,
        user_info: auth.user_info,
      };
    } else {
      return null;
    }
  }

  async getUserInfoByUsername(username: string) {
    const auth = await this.findOne({ where: { username: username } });
    if (auth) {
      return auth;
    } else {
      return null;
    }
  }

  private async setUserInfo(): Promise<UserInfo> {
    const userInfo = new UserInfo();
    await userInfo.save();
    return userInfo;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}

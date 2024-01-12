import { JwtPayload } from '../../interfaces/jwt-payload.interface';
import { SignInPayLoadInterFaceOptions } from '../../interfaces/signIn.payload.interface';
import { SignUpResponseDto } from '../../utils/interfaces/common.type';
import { SignInCredentialsDto } from '../dto/signin-credentials.dto';
import { SignupCredentialsDto } from '../dto/signup-credentials.dto';
import { User } from '../entity/user.entity';

export abstract class AuthenticationAbstractOptions {
  constructor() {}

  abstract signup(
    signUpCredentialDto: SignupCredentialsDto,
  ): Promise<SignUpResponseDto>;

  abstract signIn(
    signInCredentialDto: SignInCredentialsDto,
  ): Promise<SignInPayLoadInterFaceOptions>;

  abstract signOut(user: User): Promise<void>;

  abstract getAccessToken(payload: JwtPayload): Promise<string>;

  abstract getRefreshToken(payload: JwtPayload): Promise<string>;
  abstract updateRefreshTokenInUser(refreshToken, username): Promise<void>;
  abstract getNewAccessAndRefreshToken(payload: JwtPayload): Promise<{
    accessToken: string;
    refreshToken: string;
  }>;

  abstract getUserIfRefreshTokenMatches(
    refreshToken: string,
    username: string,
  ): Promise<User>;
}

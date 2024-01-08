import { JwtPayload } from './jwt-payload.interface';

export interface SignInPayLoadInterFaceOptions {
  accessToken: string;
  refreshToken?: string;
  user?: JwtPayload;
}

import { UserInfo } from '../user/entity/user-info.entity';

export interface JwtPayload {
  isTwoFactorEnable?: boolean;
  username: string;
  user_info: UserInfo;
  isTwoFaAuthenticated?: boolean;
}

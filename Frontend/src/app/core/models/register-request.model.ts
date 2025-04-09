import { User } from './user.model';
import { UserInfo } from './user-info.model';

export interface RegisterRequest {
  user: User;
  userInfo: UserInfo;
}

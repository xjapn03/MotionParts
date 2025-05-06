import { Role } from './login.model';
import { UserInfo } from './user-info.model';

export interface User {
  id: number;
  username: string;
  email: string;
  roles: Role[]; // Agregamos roles
  password?: string;
  userInfo: UserInfo;
}

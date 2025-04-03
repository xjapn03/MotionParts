import { Role } from './login.model';

export interface User {
  id: number;
  username: string;
  email: string;
  roles: Role[]; // Agregamos roles
  password?: string;
}

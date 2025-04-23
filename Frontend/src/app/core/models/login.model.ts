export interface Role {
  id: number;
  name: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  id: number | string;
  username: string;
  email: string;
  image?: string;
  roles: Role[]; // Agregamos roles
}

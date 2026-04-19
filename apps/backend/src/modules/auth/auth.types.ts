import type { AppUserRole } from '../../types/user-role';

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
  role?: AppUserRole;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface AuthUserDto {
  id: string;
  name: string;
  email: string;
  role: AppUserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResult {
  token: string;
  expiresIn: string;
  user: AuthUserDto;
}

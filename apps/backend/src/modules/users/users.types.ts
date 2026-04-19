import type { AppUserRole } from '../../types/user-role';

export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: AppUserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserBody {
  name: string;
  email: string;
  password: string;
  role?: AppUserRole;
}

export interface UpdateUserBody {
  name?: string;
  email?: string;
  role?: AppUserRole;
}

export interface UpdateUserPasswordBody {
  password: string;
}

export interface UserIdParams {
  id: string;
}

import { UserRole, users } from '@prisma/client';
export interface User extends users {
  id: string;
  UserId: number;
  firstName: string;
  lastName: string;
  password: string;
  salt: string;
  email: string;
  Role: UserRole;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface userLogin {
  email: string;
  password: string;
  Role: UserRole;
}

export interface UpdateUser {
  firstName?: string;
  lastName?: string;
  password?: string;
  salt?: string;
  email?: string;
  Role?: UserRole;
  isVerified?: boolean;
  updatedAt?: Date;
}

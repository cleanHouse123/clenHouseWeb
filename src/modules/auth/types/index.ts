import { User } from "@/core/types/user";

export interface LoginEmailDto {
  email: string;
  password: string;
}

export interface RegisterEmailDto {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: Omit<User, 'createdAt' | 'updatedAt' | 'lastLoginAt' | 'isEmailVerified' | 'isPhoneVerified' | 'lastLoginAt'> 
}
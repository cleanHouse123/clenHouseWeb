export enum UserRole {
  ADMIN = "admin",
  CUSTOMER = "customer",
  CURRIER = "currier",
}

export interface User {
  userId: string;
  role: UserRole;
  name: string;
  phone?: string;
  isPhoneVerified: boolean;
  email?: string;
  isEmailVerified: boolean;
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

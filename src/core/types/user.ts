import { ReferralLink } from "@/modules/referral/types";

export enum UserRole {
  ADMIN = "admin",
  CUSTOMER = "customer",
  CURRIER = "currier",
}

export interface User {
  userId: string;
  roles: UserRole[];
  name: string;
  phone?: string;
  isPhoneVerified: boolean;
  email?: string;
  isEmailVerified: boolean;
  telegramId?: string;
  adToken?: ReferralLink;
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

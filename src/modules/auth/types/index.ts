export interface SendSmsRequest {
  phoneNumber: string;
  isDev?: boolean;
}

export interface SendSmsResponse {
  message: string;
  code?: string; // Код для режима разработки
}

export interface VerifySmsRequest {
  phoneNumber: string;
  code: string;
  adToken?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    phone: string;
    email?: string;
    role: string;
    isPhoneVerified: boolean;
    isEmailVerified: boolean;
    lastLoginAt: string;
    createdAt: string;
    updatedAt: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokensRequest {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokensResponse {
  accessToken: string;
  refreshToken: string;
}

export interface VerifyTelegramRequest {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
  adToken?: string;
}

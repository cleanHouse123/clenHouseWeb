export interface SendSmsRequest {
  phoneNumber: string;
  isDev?: boolean;
}

export interface VerifySmsRequest {
  phoneNumber: string;
  code: string;
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

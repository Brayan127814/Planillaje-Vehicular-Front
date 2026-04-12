export interface LoginRequest {
    username: string,
    password: string
}

export interface AuthResponse {
  AccessToken: string;
  refreshToken: string;
}
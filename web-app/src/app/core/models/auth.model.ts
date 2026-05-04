export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  role: 'ADMIN' | 'USER';
  username: string;
}

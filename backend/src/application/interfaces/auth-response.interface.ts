export interface UserPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  role: 'PAJARERO' | 'PROVEEDOR' | 'BOTH';
  avatarUrl?: string;
  coverUrl?: string;
  department?: string;
  municipality?: string;
  businessName?: string;
  rnt?: string;
  isActive?: boolean;
  createdAt?: Date;
  failedLoginAttempts?: number;
  lockUntil?: Date;
}

export interface AuthResponse {
  access_token: string;
  user: UserPayload;
}

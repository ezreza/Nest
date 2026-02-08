import { Request } from 'express';

export interface JwtPayload {
  sub: number;
  iat?: number;
  exp?: number;
}

export interface SafeUser {
  id: number;
  name: string;
  phone: string;
  email: string;
  user_type: string;
}

export interface AuthenticatedRequest extends Request {
  user: SafeUser;
}

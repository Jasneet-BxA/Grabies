import jwt from 'jsonwebtoken';
import type { JwtPayload} from 'jsonwebtoken';
import { env } from '../config/env/index.js';

const JWT_SECRET = env.JWT_SECRET;
const JWT_EXPIRES_IN = env.JWT_EXPIRES_IN || '1d'; 

export interface TokenPayload extends JwtPayload {
  userId: string;
  email: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export function verifyToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, JWT_SECRET);
  
  if (typeof decoded === 'string') {
    throw new Error('Invalid token payload');
  }

  return decoded as TokenPayload;
}

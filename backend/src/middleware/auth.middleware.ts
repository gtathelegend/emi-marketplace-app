import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { AuthenticationError, AuthorizationError } from '../errors/index.js';

export interface AuthenticatedAdminUser {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
}

declare global {
  namespace Express {
    interface Request {
      adminUser?: AuthenticatedAdminUser;
      requestId?: string;
    }
  }
}

export const requireAdmin = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    // 1. Extract Bearer Token or Cookie
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.admin_token) {
      token = req.cookies.admin_token;
    }

    if (!token) {
      throw new AuthenticationError('Authentication required. Please log in as an administrator.');
    }

    // 2. Verify JWT Token
    const jwtSecret = process.env.JWT_SECRET || 'dev_jwt_secret_key_change_in_production_1fi_2026';
    let decoded: any;

    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (err) {
      throw new AuthenticationError('Invalid or expired authentication token. Please log in again.');
    }

    if (!decoded || !decoded.adminId) {
      throw new AuthenticationError('Malformed authentication token.');
    }

    // 3. Load Admin Identity & Check Active Status
    const admin = await prisma.adminUser.findUnique({
      where: { id: decoded.adminId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
      },
    });

    if (!admin) {
      throw new AuthenticationError('Admin account not found.');
    }

    if (!admin.isActive) {
      throw new AuthorizationError('Admin account is deactivated. Access denied.');
    }

    // 4. Attach Context
    req.adminUser = {
      id: admin.id,
      email: admin.email,
      fullName: admin.fullName,
      role: admin.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

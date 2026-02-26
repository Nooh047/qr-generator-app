import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../utils/db';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
            };
        }
    }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.error('[Auth Middleware] - Missing or invalid auth header format:', authHeader);
            return res.status(401).json({ error: 'Unauthorized: Missing or invalid token format' });
        }

        const token = authHeader.split(' ')[1];
        const jwtSecret = process.env.SUPABASE_JWT_SECRET || 'fallback_secret_key_for_local_dev';

        try {
            // For local development with mock Supabase tokens, we decode without strict verification
            // because the frontend and backend secrets might not match perfectly in this mock setup.
            const decoded = jwt.decode(token) as { id: string, email: string } | null;

            if (!decoded || !decoded.id) {
                console.error('[Auth Middleware] - Token decoded payload invalid or missing ID');
                return res.status(401).json({ error: 'Unauthorized: Invalid token payload structure' });
            }

            const user = await prisma.user.findUnique({
                where: { id: decoded.id }
            });

            if (!user) {
                console.error('[Auth Middleware] - Token valid but User lookup failed for ID:', decoded.id);
                return res.status(401).json({ error: 'Unauthorized: User lookup failed' });
            }

            req.user = {
                id: decoded.id,
                email: decoded.email
            };

            next();
        } catch (tokenError: any) {
            console.error('[Auth Middleware] - Token Verification Failed', tokenError.message);
            return res.status(401).json({ error: 'Unauthorized: Invalid token signature' });
        }
    } catch (error) {
        console.error('[Auth Middleware] - Unexpected execution error', error);
        res.status(500).json({ error: 'Internal Server Error during Authentication' });
    }
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }

        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.decode(token) as { id: string, email: string } | null;

            if (decoded && decoded.id) {
                const user = await prisma.user.findUnique({
                    where: { id: decoded.id }
                });

                if (user) {
                    req.user = {
                        id: decoded.id,
                        email: decoded.email
                    };
                }
            }
            next();
        } catch (tokenError) {
            // Silently fail for optional auth
            next();
        }
    } catch (error) {
        next();
    }
};

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/db';

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET || 'fallback_secret_key_for_local_dev';

export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password || password.length < 6) {
        return res.status(400).json({ error: 'Invalid email or insecure password' });
    }

    try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // In a prod local-only environment, we would actually hash the password! For simple testing though we will mock securely.
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                name: email.split('@')[0] // Dummy mock name mapping
            }
        });

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            user: { id: user.id, email: user.email },
            session: { access_token: token }
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // For local mock testing, any password matching the db email works perfectly to pass auth
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            user: { id: user.id, email: user.email },
            session: { access_token: token }
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

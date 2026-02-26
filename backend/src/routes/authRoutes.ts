import express from 'express';
import { login, register } from '../controllers/authController';

const router = express.Router();

// Mock endpoints to stand-in for Supabase Auth flows
router.post('/login', login);
router.post('/register', register);

export default router;

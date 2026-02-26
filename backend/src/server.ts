import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';

// Load environmental variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Centralized Security and Logging Middleware
app.use(helmet({
    crossOriginResourcePolicy: false, // Permit loading from other domains
}));
app.use(cors({ origin: '*' })); // Open CORS entirely for public routing links
app.use(express.json());
app.use(morgan('dev')); // Standard request logging

// Baseline Health Check Route
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ success: true, message: 'Dynamic QR Engine API is Online' });
});

import qrRoutes from './routes/qrRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import redirectRoutes from './routes/redirectRoutes';
import authRoutes from './routes/authRoutes';

// Configure Service API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/qr', qrRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// Configure Smart Redirect Engine API Route (Kept distinctly terse for clean URLs)
app.use('/r', redirectRoutes);

// Fallback handling pattern for unmatched application routes
app.use((req: Request, res: Response) => {
    res.status(404).json({ success: false, message: 'API route completely unmatched or not found' });
});

// Finalize configuration with Global Error Handling mechanism
app.use(errorHandler);

// Engage local listener loop
app.listen(PORT, () => {
    console.log(`[Server System] Environment context: ${process.env.NODE_ENV}`);
    console.log(`[Server System] Runtime active on port ${PORT}`);
});

export default app;

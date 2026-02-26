import { Request, Response, NextFunction } from 'express';

/**
 * Global Error Handler Middleware Logic.
 * Captures all trailing express errors and transforms logic into consistent JSON outputs cleanly.
 */
export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(`[Error Boundary Captured] ${err.name}: ${err.message}`);

    // Guarantee HTTP error state instead of falling back seamlessly to an accidental 200 generic code
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Fatal Internal Server Application Error',
        // Emit native stack tracing arrays logically only contextually in pure dev environments
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

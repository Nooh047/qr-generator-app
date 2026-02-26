import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps async express routes to automatically catch errors and pass them to the global errorHandler.
 */
export const asyncHandler = (fn: RequestHandler): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err.stack);
    
    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
    }
    
    res.status(500).json({ error: 'Something went wrong!' });
}

export function notFound(req: Request, res: Response, next: NextFunction) {
    res.status(404).json({ error: 'Not found' });
}
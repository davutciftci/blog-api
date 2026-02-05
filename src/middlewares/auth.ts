import { getUserById } from "../services/user";
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Extend Express Request type to include user property
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

interface JwtPayload {
    userId: string;
    email: string;
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                error: 'Authentication required'
            });
            return;
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

        const user = await getUserById((decoded as JwtPayload).userId)
        req.user = user;
        next();
    } catch (error) {
        if((error as jwt.JsonWebTokenError).name === 'JsonWebTokenError') {
            return res.status(401).json({
                error: 'Invalid token'
            })
        }
        if((error as jwt.TokenExpiredError).name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token expired'
            })
        }
        return res.status(500).json({ error: 'Internal server error'})
    }
}
import jwt from 'jsonwebtoken';
import { findUserById } from '../services/userService.js';

// Authenticate Middleware
export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check token presence
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next({
                status: 401,
                message: 'Token missing'
            });
        }

        // Extract token
        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'default_jwt_secret'
        );

        // Find user
        const user = await findUserById(decoded.id);

        // Validate user
        if (!user || user.status === 'inactive') {
            return next({
                status: 401,
                message: 'Unauthorized'
            });
        }

        // Attach user to request
        req.user = user;

        next();

    } catch (error) {
        next({
            status: 401,
            message: 'Invalid token'
        });
    }
};

// Authorize Middleware (Role-based access)
export const authorize = (...roles) => {
    return (req, res, next) => {

        // Check if user exists
        if (!req.user) {
            return next({
                status: 401,
                message: 'Unauthorized'
            });
        }

        // Check role permission
        if (!roles.includes(req.user.role)) {
            return next({
                status: 403,
                message: 'Forbidden'
            });
        }

        next();
    };
};
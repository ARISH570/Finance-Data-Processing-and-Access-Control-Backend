import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '../services/userService.js';

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET || 'default_jwt_secret',
        { expiresIn: '7d' }
    );
};

// Signup Controller
export const signup = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Validation
        if (!name || !email || !password) {
            return next({
                status: 400,
                message: 'Name, email, and password are required'
            });
        }

        // Create User
        const user = await createUser({
            name,
            email,
            password,
            role
        });

        // Generate Token
        const token = generateToken(user._id);

        // Response
        res.status(201).json({
            user,
            token
        });

    } catch (error) {
        next(error);
    }
};

// Login Controller
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return next({
                status: 400,
                message: 'Email and password are required'
            });
        }

        // Find User
        const user = await findUserByEmail(email);

        // Check user & status
        if (!user || user.status === 'inactive') {
            return next({
                status: 401,
                message: 'Invalid credentials'
            });
        }

        // Match Password
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return next({
                status: 401,
                message: 'Invalid credentials'
            });
        }

        // Response
        res.json({
            user,
            token: generateToken(user._id)
        });

    } catch (error) {
        next(error);
    }
};
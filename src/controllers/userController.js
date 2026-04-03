import {
    createUser,
    getAllUsers,
    updateUserRoleStatus
} from '../services/userService.js';

// Create User
export const createUserHandler = async (req, res, next) => {
    try {
        const { name, email, password, role, status } = req.body;

        // Validation
        if (!name || !email || !password) {
            return next({
                status: 400,
                message: 'name, email, and password are required'
            });
        }

        // Create User
        const user = await createUser({
            name,
            email,
            password,
            role,
            status
        });

        // Response
        res.status(201).json(user);

    } catch (error) {
        next(error);
    }
};

// Get All Users
export const getUsersHandler = async (req, res, next) => {
    try {
        const users = await getAllUsers();

        res.json(users);

    } catch (error) {
        next(error);
    }
};

// Update User Role / Status
export const patchUserHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role, status } = req.body;

        // Validation
        if (!role && !status) {
            return next({
                status: 400,
                message: 'At least one of role or status is required'
            });
        }

        // Update User
        const user = await updateUserRoleStatus(id, {
            role,
            status
        });

        // Response
        res.json(user);

    } catch (error) {
        next(error);
    }
};
import User from '../models/userModel.js';

// Create User
export const createUser = async (data) => {
    const existingUser = await User.findOne({ email: data.email });

    if (existingUser) {
        throw {
            status: 400,
            message: 'Email already exists'
        };
    }

    const newUser = await User.create(data);
    return newUser;
};

// Get All Users
export const getAllUsers = async () => {
    const users = await User.find().select('-password');
    return users;
};

// Update User Role & Status
export const updateUserRoleStatus = async (id, changes) => {
    const user = await User.findById(id);

    if (!user) {
        throw {
            status: 404,
            message: 'User not found'
        };
    }

    if (changes.role) {
        user.role = changes.role;
    }

    if (changes.status) {
        user.status = changes.status;
    }

    await user.save();
    return user;
};

// Find User by Email
export const findUserByEmail = async (email) => {
    const user = await User.findOne({ email: email });
    return user;
};

// Find User by ID
export const findUserById = async (id) => {
    const user = await User.findById(id);
    return user;
};
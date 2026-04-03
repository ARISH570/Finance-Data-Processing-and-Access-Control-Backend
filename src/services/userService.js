import User from '../models/userModel.js';
export const createUser=async(data)=>{const exists=await User.findOne({email:data.email});if(exists)throw {status:400,message:'Email already exists'};return User.create(data);};
export const getAllUsers=()=>User.find().select('-password');
export const updateUserRoleStatus=async(id,changes)=>{const user=await User.findById(id);if(!user)throw {status:404,message:'User not found'};if(changes.role)user.role=changes.role; if(changes.status)user.status=changes.status;await user.save();return user;};
export const findUserByEmail=async(email)=>User.findOne({email});
export const findUserById=async(id)=>User.findById(id);

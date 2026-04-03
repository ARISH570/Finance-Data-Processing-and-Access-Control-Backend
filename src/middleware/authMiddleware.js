import jwt from 'jsonwebtoken';
import {findUserById} from '../services/userService.js';
export const authenticate=async(req,res,next)=>{try{const h=req.headers.authorization; if(!h||!h.startsWith('Bearer '))throw {status:401,message:'Token missing'};const token=h.split(' ')[1];const decoded=jwt.verify(token,process.env.JWT_SECRET);const user=await findUserById(decoded.id);if(!user||user.status==='inactive')throw {status:401,message:'Unauthorized'};req.user=user;next();}catch(err){next({status:401,message:'Invalid token'});} };
export const authorize=(...roles)=> (req,res,next)=>{if(!req.user)return next({status:401,message:'Unauthorized'}); if(!roles.includes(req.user.role))return next({status:403,message:'Forbidden'});next();};

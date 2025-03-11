import express from 'express';
import { getUserProfile, updateUserProfile, getUsers, deleteUser } from '../controllers/userController';
import { protect, admin } from '../middleware/auth';

export const userRouter = express.Router();

// Private routes (require authentication)
userRouter.get('/profile', protect, getUserProfile);
userRouter.put('/profile', protect, updateUserProfile);

// Admin routes
userRouter.get('/', protect, admin, getUsers);
userRouter.delete('/:id', protect, admin, deleteUser);
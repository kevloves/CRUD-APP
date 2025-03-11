import express from 'express';
import { registerUser, loginUser } from '../controllers/authController';

export const authRouter = express.Router();

// Register a new user
authRouter.post('/register', registerUser);

// Login user
authRouter.post('/login', loginUser);
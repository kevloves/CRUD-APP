import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken } from '../utils/generateToken';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  try {
    console.log('Register request received:', req.body);
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      console.log('User already exists');
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    try {
      const user = await User.create({
        username,
        email,
        password,
      });

      if (user) {
        console.log('User created successfully');
        res.status(201).json({
          _id: user._id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user._id.toString()),
        });
      } else {
        console.log('Invalid user data');
        res.status(400).json({ message: 'Invalid user data' });
      }
    } catch (createError: any) {
      console.error('Error creating user:', createError);
      res.status(400).json({ message: createError.message });
    }
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
  try {
    console.log('Login request received:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check for user email
    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    try {
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        console.log('Invalid password');
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      console.log('Login successful');
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id.toString()),
      });
    } catch (passwordError: any) {
      console.error('Password comparison error:', passwordError);
      res.status(500).json({ message: 'Error verifying password' });
    }
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};
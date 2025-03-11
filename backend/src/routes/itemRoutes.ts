import express from 'express';
import { getItems, getItemById, createItem, updateItem, deleteItem } from '../controllers/itemController';
import { protect } from '../middleware/auth';

export const itemRouter = express.Router();

// Public routes
itemRouter.get('/', getItems);
itemRouter.get('/:id', getItemById);

// Private routes (require authentication)
itemRouter.post('/', protect, createItem);
itemRouter.put('/:id', protect, updateItem);
itemRouter.delete('/:id', protect, deleteItem);
import { Request, Response } from 'express';
import { Item } from '../models/Item';

// @desc    Get all items
// @route   GET /api/items
// @access  Public
export const getItems = async (req: Request, res: Response) => {
  try {
    const items = await Item.find({}).sort({ createdAt: -1 }).populate('createdBy', 'username');
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Public
export const getItemById = async (req: Request, res: Response) => {
  try {
    const item = await Item.findById(req.params.id).populate('createdBy', 'username');
    
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an item
// @route   POST /api/items
// @access  Private
export const createItem = async (req: Request, res: Response) => {
  try {
    const { title, description, price, category } = req.body;

    const item = await Item.create({
      title,
      description,
      price,
      category,
      createdBy: req.user._id,
    });

    res.status(201).json(item);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an item
// @route   PUT /api/items/:id
// @access  Private
export const updateItem = async (req: Request, res: Response) => {
  try {
    const { title, description, price, category } = req.body;

    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if user is the item creator or an admin
    if (item.createdBy.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    item.title = title || item.title;
    item.description = description || item.description;
    item.price = price ?? item.price;
    item.category = category || item.category;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Private
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if user is the item creator or an admin
    if (item.createdBy.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await item.deleteOne();
    res.json({ message: 'Item removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
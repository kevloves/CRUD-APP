import api from './api';
import { Item, ItemFormData } from '../types/item';

export const getItems = async (): Promise<Item[]> => {
  const response = await api.get('/items');
  return response.data;
};

export const getItemById = async (id: string): Promise<Item> => {
  const response = await api.get(`/items/${id}`);
  return response.data;
};

export const createItem = async (itemData: ItemFormData): Promise<Item> => {
  const response = await api.post('/items', itemData);
  return response.data;
};

export const updateItem = async (id: string, itemData: ItemFormData): Promise<Item> => {
  const response = await api.put(`/items/${id}`, itemData);
  return response.data;
};

export const deleteItem = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete(`/items/${id}`);
  return response.data;
};
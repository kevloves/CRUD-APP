export interface Item {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  createdBy: {
    _id: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ItemFormData {
  title: string;
  description: string;
  price: number;
  category: string;
}
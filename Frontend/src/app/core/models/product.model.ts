import { Category } from "./category.model";

export interface Product {
  id: number;
  reference: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categories: Category[]; // 🔹 Cambiado de categoryIds a categories
  created_at: string;
  updated_at: string;
  image?: string;
}

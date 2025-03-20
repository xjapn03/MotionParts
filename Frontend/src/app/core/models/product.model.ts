export interface Product {
  id: number;
  reference: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryIds: number[]; // 🔹 Ahora es un array en lugar de un solo número
  created_at: string;
  updated_at: string;
  image?: string;
}

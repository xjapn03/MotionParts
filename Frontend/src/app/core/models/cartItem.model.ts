import { Product } from "./product.model"; // Asegúrate de importar correctamente Product

export interface CartItem {
  id: number;
  shoppingCartId: number;
  product: Product;  // 🔹 Debe coincidir con lo que envía el backend
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

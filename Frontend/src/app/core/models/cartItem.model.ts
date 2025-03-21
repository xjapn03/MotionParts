import { Product } from "./product.model"; // Asegúrate de importar correctamente Product

export interface CartItem {
  id: number;
  shoppingCartId?: number;  // 🔹 Hacerlo opcional con '?'
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

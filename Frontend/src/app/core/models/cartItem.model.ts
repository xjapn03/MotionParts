export interface CartItem {
    id: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    shoppingCartId: number; //relacion con carrito de compras
  }
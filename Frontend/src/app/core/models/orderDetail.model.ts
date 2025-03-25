export interface OrderDetail {
  id: number;
  orderId: number;
  productId: number;
  productName: string; // Para mostrar en el frontend
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

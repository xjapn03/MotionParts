import { OrderDetail } from './orderDetail.model';
export interface Order {
  id: number;
  userId: number;
  orderDetails: OrderDetail[]; // Relación con los detalles de la orden
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'CANCELED'; // Enum de estados de la orden
  total: number;
  paymentMethod: string;
  pickupLocation: string | null; // Puede ser `null` si no es recogida en tienda
  createdAt: string; // Fecha de creación en formato ISO
}

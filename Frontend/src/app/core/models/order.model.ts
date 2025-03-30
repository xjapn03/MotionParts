import { OrderDetail } from './orderDetail.model';

export interface BillingData {
  firstName?: string | null;
  lastName?: string | null;
  idType?: string | null;
  idNumber?: string | null;
  address?: string | null;
  addressDetail?: string | null;
  country?: string | null;
  region?: string | null;
  city?: string | null;
  postalCode?: string | null;
  phone?: string | null;
  email?: string | null;
}

export interface ShippingData {
  firstName?: string | null;
  lastName?: string | null;
  address?: string | null;
  addressDetail?: string | null;
  country?: string | null;
  region?: string | null;
  city?: string | null;
  postalCode?: string | null;
  notes?: string | null;
}

export interface Order {
  id: number;
  userId: number;
  username?: string;
  orderDetails: OrderDetail[]; // Relación con los detalles de la orden
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'CANCELED'; // Enum de estados de la orden
  total: number;
  paymentMethod: string;
  pickupLocation?: string | null; // Puede ser `null` si no es recogida en tienda
  createdAt: Date | string; // Fecha de creación en formato ISO
  acceptedTerms: boolean; // ✅ Agregado

  // ✅ Información agrupada
  billingData?: BillingData | null;
  shippingData?: ShippingData | null;

  // ✅ Cupón y método de envío
  couponCode?: string | null;
  shippingMethod?: string | null;
}

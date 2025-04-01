// order.model.ts
export interface Product {
    description: string;
    price: number;
  }
  
  export interface Order {
    id: string;
    date: string;
    customer: string;
    items: Product[];
    total: number;
    shippingAddress: string;
    paymentMethod: string;
    status: 'Pendiente' | 'Entregado' | 'Erróneo';  // Un solo estado por orden
  }
  
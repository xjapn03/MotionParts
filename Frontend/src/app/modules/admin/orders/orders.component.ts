import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from './order.model';  // Asegúrate de importar el modelo

@Component({
  selector: 'app-orders',
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [
    {
      id: 'ORD-001',
      date: '2025-03-20',
      customer: 'Juan Pérez',
      items: [
        { description: 'Frenos de disco', price: 50 },
        { description: 'Bujías', price: 15 },
      ],
      total: 65,
      shippingAddress: 'Calle Ficticia 123, Ciudad X',
      paymentMethod: 'Tarjeta de Crédito',
      status: 'Pendiente'
    },
    {
      id: 'ORD-002',
      date: '2025-03-21',
      customer: 'Carlos Díaz',
      items: [
        { description: 'Aceite motor', price: 30 },
        { description: 'Filtro de aire', price: 10 },
      ],
      total: 40,
      shippingAddress: 'Avenida Principal 456, Ciudad Y',
      paymentMethod: 'PayPal',
      status: 'Entregado'
    }
  ];

  constructor() {}

  ngOnInit(): void {}

  // Función para cambiar el estado de las órdenes
  updateOrderStatus(orderId: string, status: 'Pendiente' | 'Entregado' | 'Erróneo'): void {
    const order = this.orders.find(order => order.id === orderId);
    if (order) {
      order.status = status;
    }
  }

  // Toggle para mostrar detalles de la orden
  showDetails: { [key: string]: boolean } = {};

  toggleDetails(orderId: string): void {
    this.showDetails[orderId] = !this.showDetails[orderId];
  }
}

import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';
import { Router } from '@angular/router'; // ✅ Importamos Router
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  userId = 1; // TODO: Obtener el ID real del usuario autenticado
  orders: Order[] = [];

  constructor(private orderService: OrderService, private router: Router) {} // ✅ Inyectamos Router

  ngOnInit(): void {
    this.loadUserOrders();
  }

  loadUserOrders(): void {
    this.orderService.getUserOrders(this.userId).subscribe({
      next: (data) => (this.orders = data),
      error: (err) => console.error('Error al cargar órdenes:', err),
    });
  }

  // ✅ Método para ver detalles de una orden
  viewOrderDetails(orderId: number): void {
    this.router.navigate(['/admin/orders', orderId]);
  }

  // ✅ Método para cancelar una orden
  cancelOrder(orderId: number): void {
    if (confirm('¿Seguro que quieres cancelar esta orden?')) {
      this.orderService.cancelOrder(orderId).subscribe({
        next: () => {
          alert('Orden cancelada');
          this.loadUserOrders(); // 🔄 Recargar órdenes después de cancelar
        },
        error: (err) => console.error('Error al cancelar orden:', err),
      });
    }
  }
}

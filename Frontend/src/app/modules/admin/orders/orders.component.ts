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
    this.orderService.getAllOrdersWithUsernames().subscribe({
      next: (data) => (this.orders = data),
      error: (err) => console.error('Error al cargar órdenes:', err),
    });
  }

  // ✅ Método para ver detalles de una orden
  viewOrderDetails(orderId: number): void {
    // Lógica para saber si el usuario es administrador o no
    const isAdmin = true;  // O utilizar una variable de usuario o un guard para determinar esto

    if (isAdmin) {
      // Redirigir al detalle de la orden del admin
      this.router.navigate(['/admin/order-details', orderId]);
    } else {
      // Redirigir al detalle de la orden del usuario
      this.router.navigate(['/my-orders', orderId]);
    }
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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Importar CommonModule
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';
import { AuthService } from '../../../core/services/auth.service'; // Para obtener el usuario autenticado
import { Router } from '@angular/router';
@Component({
  selector: 'app-my-orders',
  standalone: true, // Si usas standalone components
  imports: [CommonModule], // ✅ Agregar CommonModule para pipes y directivas como *ngFor
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.css'
})
export class MyOrdersComponent implements OnInit {
  orders: Order[] = [];
  userId!: number;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user && user.id) {
      this.userId = user.id;
      this.loadOrders();
    } else {
      console.error('No se pudo obtener el ID del usuario');
    }
  }

  loadOrders(): void {
    this.orderService.getUserOrders(this.userId).subscribe({
      next: (data) => (this.orders = data),
      error: (err) => console.error('Error al cargar órdenes:', err),
    });
  }

  viewOrderDetails(orderId: number): void {
    this.router.navigate(['/my-orders', orderId]);
  }

  cancelOrder(orderId: number): void {
    if (confirm('¿Seguro que quieres cancelar esta orden?')) {
      this.orderService.cancelOrder(orderId).subscribe({
        next: () => {
          alert('Orden cancelada');
          this.loadOrders(); // Recargar lista
        },
        error: (err) => console.error('Error al cancelar orden:', err),
      });
    }
  }
}

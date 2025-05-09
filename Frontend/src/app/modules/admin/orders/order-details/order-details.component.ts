import { OrderDetail } from './../../../../core/models/orderDetail.model';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../../core/services/order.service';
import { Order } from '../../../../core/models/order.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./order-details.component.css']
})
export class AdminOrderDetailsComponent implements OnInit {
  orderId: number = 0;
  order: Order | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';
  originalStatus: string = '';

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.orderId = +params['id'];
      this.loadOrderDetails();
    });
  }

  loadOrderDetails(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.orderService.getOrderById(this.orderId).subscribe({
      next: (data) => {
        this.order = data;
        this.originalStatus = data.status;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar los detalles de la orden:', err);
        this.errorMessage = 'No se pudieron cargar los detalles de la orden';
        this.isLoading = false;
      },
    });
  }

  calculateTotal(): number {
    if (!this.order?.orderDetails || this.order.orderDetails.length === 0) {
      return 0;
    }
    
    return this.order.orderDetails.reduce((sum, detail) => {
      return sum + (detail.unitPrice * detail.quantity);
    }, 0);
  }

  updateOrder(): void {
    if (!this.order) return;
    
    // Si solo cambió el estado, usar el método específico
    if (this.originalStatus !== this.order.status) {
      this.orderService.updateOrderStatus(this.orderId, this.order.status).subscribe({
        next: (updatedOrder) => {
          this.order = updatedOrder;
          this.originalStatus = updatedOrder.status;
          this.showSuccessMessage('Estado de la orden actualizado correctamente');
        },
        error: (err) => {
          console.error('Error al actualizar el estado de la orden:', err);
          this.showErrorMessage('Error al actualizar el estado de la orden');
        },
      });
    } else {
      this.showSuccessMessage('No se detectaron cambios en la orden');
    }
  }

  showSuccessMessage(message: string): void {
    // Implementa esto con tu sistema de notificaciones preferido
    alert(message);
  }

  showErrorMessage(message: string): void {
    // Implementa esto con tu sistema de notificaciones preferido
    alert(message);
  }

  goBack(): void {
    this.router.navigate(['/admin/orders']);
  }
}

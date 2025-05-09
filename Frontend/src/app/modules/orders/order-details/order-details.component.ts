import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-details',
  standalone: true, // Si usas standalone components
  imports: [CommonModule], // ✅ Agregar CommonModule para usar *ngIf, *ngFor y pipes
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent implements OnInit {
  order: Order | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router, // ✅ Se inyecta correctamente el Router
    private orderService: OrderService
  ) {}

  goBack() {
    this.router.navigate(['/my-orders']);
  }

  ngOnInit(): void {
    const orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadOrderDetails(orderId);
  }

  loadOrderDetails(orderId: number): void {
    this.orderService.getOrderById(orderId).subscribe({
      next: (data) => (this.order = data),
      error: (err) => console.error('Error al cargar detalles:', err),
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
}

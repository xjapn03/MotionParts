import { OrderDetail } from './../../../../core/models/orderDetail.model';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../../core/services/order.service';
import { Order } from '../../../../core/models/order.model';
import { FormsModule } from '@angular/forms'; // Importar FormsModule

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./order-details.component.css']
})
export class AdminOrderDetailsComponent implements OnInit {
  orderId: number = 0; // Valor inicial por defecto
  order: Order = {
    id: 0,
    status: 'PENDING',
    total: 0,
    createdAt: new Date().toISOString(),
    paymentMethod: '',
    userId: 0,  // Agregar el valor adecuado
    acceptedTerms: false,

    shippingData: {
      firstName: '',
      lastName: '',
      address: '',
      addressDetail: '',
      city: '',
      region: '',
      country: ''
    },
    billingData: {
      firstName: '',
      lastName: '',
      email: ''
    },
    orderDetails: [] as OrderDetail[]
  };

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.orderId = params['id'];
      this.loadOrderDetails();
    });
  }

  loadOrderDetails(): void {
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (data) => {
        this.order = data;  // Asignar los detalles de la orden
      },
      error: (err) => console.error('Error al cargar los detalles de la orden:', err),
    });
  }

  updateOrder(): void {
    this.orderService.updateOrderStatus(this.orderId, this.order.status).subscribe({
      next: (updatedOrder) => {
        this.order = updatedOrder;  // Actualizar la orden con los nuevos datos
        alert('Orden actualizada correctamente');
      },
      error: (err) => console.error('Error al actualizar la orden:', err),
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/orders']);
  }
}


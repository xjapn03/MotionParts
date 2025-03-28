import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model'; // Importa el modelo Order

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/orders'; // URL del backend

  constructor(private http: HttpClient) {}

  // ✅ Crear una orden
  // order.service.ts
  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/users/${order.userId}`, order);
  }


  // ✅ Obtener todas las órdenes de un usuario
  getUserOrders(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/users/${userId}`);
  }

  // ✅ Obtener una orden por su ID
  getOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${orderId}`);
  }

  // ✅ Actualizar el estado de una orden
  updateOrderStatus(orderId: number, status: 'PENDING' | 'PAID' | 'SHIPPED' | 'CANCELED'): Observable<Order> {
    const params = new HttpParams().set('status', status);
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/update-status`, {}, { params });
  }

  // ✅ Cancelar una orden
  cancelOrder(orderId: number): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/cancel`, {});
  }
}

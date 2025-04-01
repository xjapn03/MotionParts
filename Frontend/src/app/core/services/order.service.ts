import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, of} from 'rxjs';
import { Order } from '../models/order.model';
import { UserService } from '../services/user.service';
import { map, switchMap, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/orders'; // URL del backend

  constructor(private http: HttpClient, private userService: UserService) {} // ✅ Inyectamos UserService

  // ✅ Crear una orden
  // order.service.ts
  createOrder(order: Order): Observable<Order> {
    console.log('📢 Enviando orden:', order);
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

  getAllOrdersWithUsernames(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl).pipe(
      tap((orders) => console.log('📢 Órdenes obtenidas:', orders)), // 🛠️ Depuración
      switchMap((orders: Order[]) => {
        if (!orders.length) return of([]); // Si no hay órdenes, retorna un array vacío

        // Obtención de los usuarios para cada orden
        const userRequests = orders.map(order =>
          this.userService.getUserById(order.userId).pipe(
            map(user => ({ ...order, username: user.username })) // Agregar el nombre de usuario a cada orden
          )
        );

        return forkJoin(userRequests) as Observable<Order[]>; // 🔹 Asegura el tipo correcto
      })
    );
  }


}

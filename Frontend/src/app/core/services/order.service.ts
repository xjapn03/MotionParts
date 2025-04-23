import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders  } from '@angular/common/http';
import { Observable, forkJoin, of} from 'rxjs';
import { Order } from '../models/order.model';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { map, switchMap, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/orders'; // URL del backend

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private authService: AuthService // Inyectamos AuthService para obtener el token
  ) {}

  // Crear una orden
  createOrder(order: Order): Observable<Order> {
    console.log('📢 Enviando orden:', order);

    const token = this.authService.getToken(); // Obtenemos el token del localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    if (!order.userId || order.userId === 0) {
      // Usuario invitado ➔ Endpoint de guests
      return this.http.post<Order>(`${this.apiUrl}/guests`, order, { headers });
    } else {
      // Usuario registrado ➔ Endpoint de users (sin enviar userId en la URL)
      return this.http.post<Order>(`${this.apiUrl}/users`, order, { headers });
    }
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
      tap((orders) => console.log('📢 Órdenes obtenidas:', orders)),
      switchMap((orders: Order[]) => {
        if (!orders.length) return of([]);

        const userRequests = orders.map(order => {
          if (order.userId) {
            // Solo si el order.userId existe (no null ni undefined)
            return this.userService.getUserById(order.userId).pipe(
              map(user => ({ ...order, username: user.username }))
            );
          } else {
            // Si no tiene userId (invitado), solo devolvemos el order tal cual
            return of({ ...order, username: 'Invitado' });
          }
        });

        return forkJoin(userRequests) as Observable<Order[]>;
      })
    );
  }

}

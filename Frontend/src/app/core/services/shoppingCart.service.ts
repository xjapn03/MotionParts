import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShoppingCart } from '../models/shoppingCart.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private apiUrl = 'http://localhost:8080/api/shopping-carts'; // URL del backend

  constructor(private http: HttpClient) {}

 // ✅ Obtener el carrito del usuario autenticado
  getUserShoppingCart(userId: number): Observable<ShoppingCart> {
    return this.http.get<ShoppingCart>(`${this.apiUrl}/user/${userId}`);
  }

}

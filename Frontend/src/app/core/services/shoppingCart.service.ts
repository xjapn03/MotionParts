import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShoppingCart } from '../../core/models/shoppingCart.model';
import { CartItem } from '../../core/models/cartItem.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private apiUrl = 'http://localhost:8080/api/shoppingCart'; // Ajusta la URL según tu backend

  constructor(private http: HttpClient) {}

  // Obtener todos los carritos
  getShoppingCarts(): Observable<ShoppingCart[]> {
    return this.http.get<ShoppingCart[]>(`${this.apiUrl}/all`);
  }

  // Obtener carrito por ID
  getShoppingCartById(id: number): Observable<ShoppingCart> {
    return this.http.get<ShoppingCart>(`${this.apiUrl}/${id}`);
  }

  // Obtener carritos por ID de cliente
  getShoppingCartsByClientId(clientId: number): Observable<ShoppingCart[]> {
    return this.http.get<ShoppingCart[]>(`${this.apiUrl}/client/${clientId}`);
  }

  // Crear o actualizar carrito
  createOrUpdateShoppingCart(cart: ShoppingCart): Observable<ShoppingCart> {
    return this.http.post<ShoppingCart>(this.apiUrl, cart);
  }

  // Eliminar carrito por ID
  deleteShoppingCart(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Calcular el total del carrito
  calculateCartTotal(cartId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${cartId}/total`);
  }

  // Obtener items del carrito por ID de carrito
  getCartItemsByCartId(cartId: number): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.apiUrl}/${cartId}/items`);
  }
}
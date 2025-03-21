import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { ShoppingCart } from '../models/shoppingCart.model';
import { CartItem } from '../models/cartItem.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private apiUrl = 'http://localhost:8080/api/shopping-carts';
  private cartCount = new BehaviorSubject<number>(0); // 🔥 Estado reactivo del contador
  cartCount$ = this.cartCount.asObservable();

  constructor(private http: HttpClient) {
    this.updateCartCount(); // Inicializa el contador con el valor actual
  }

  initializeGuestCart() {
    if (!localStorage.getItem('guestCart')) {
      localStorage.setItem('guestCart', JSON.stringify([]));
    }
  }

  // ✅ Obtener el carrito del usuario autenticado
  getUserShoppingCart(userId: number): Observable<ShoppingCart> {
    return this.http.get<ShoppingCart>(`${this.apiUrl}/users/${userId}`);
  }

  // ✅ Agregar producto al carrito del usuario autenticado
  addToCart(userId: number, item: CartItem): Observable<ShoppingCart> {
    return this.http.post<ShoppingCart>(`${this.apiUrl}/users/${userId}/add`, item);
  }

  // ✅ Obtener carrito del localStorage para usuarios no autenticados
  getGuestCart(): CartItem[] {
    const cart = localStorage.getItem('guestCart');
    return cart ? JSON.parse(cart) : [];
  }

  // ✅ Guardar carrito en localStorage
  saveGuestCart(cart: CartItem[]) {
    localStorage.setItem('guestCart', JSON.stringify(cart));
    this.updateCartCount(); // 🔥 Actualizar el contador tras cada cambio
  }

  // ✅ Agregar producto al carrito del usuario no autenticado
  addToGuestCart(item: CartItem) {
    let cart = this.getGuestCart();
    const existingItem = cart.find(cartItem => cartItem.product.id === item.product.id);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      cart.push(item);
    }

    this.saveGuestCart(cart);
  }

  // ✅ Método para actualizar el contador del carrito
  private updateCartCount() {
    const cart = this.getGuestCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    this.cartCount.next(totalItems);
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: any[] = []; // Lista de productos en el carrito
  private cartSubject = new BehaviorSubject<any[]>(this.cartItems);

  constructor() {}

  // Obtener productos del carrito como Observable
  getCart() {
    return this.cartSubject.asObservable();
  }

  // Agregar un producto al carrito
  addToCart(product: any) {
    this.cartItems.push(product);
    this.cartSubject.next(this.cartItems); // Notificar cambios
  }

  // Eliminar un producto del carrito
  removeFromCart(index: number) {
    this.cartItems.splice(index, 1);
    this.cartSubject.next(this.cartItems);
  }

  // Vaciar carrito
  clearCart() {
    this.cartItems = [];
    this.cartSubject.next(this.cartItems);
  }
}

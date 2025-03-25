import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { ShoppingCart } from '../models/shoppingCart.model';
import { CartItem } from '../models/cartItem.model';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private apiUrl = 'http://localhost:8080/api/shopping-carts';
  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();
  private userId?: number;

  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  constructor(private http: HttpClient) {
    this.updateCartCount();
  }

  setUserId(userId: number) {
    this.userId = userId;
  }

  initializeGuestCart() {
    if (!localStorage.getItem('guestCart')) {
      localStorage.setItem('guestCart', JSON.stringify([]));
    }
  }



  getUserShoppingCart(): Observable<ShoppingCart> {
    if (!this.userId) {
      const guestCart = this.getGuestCart();
      return of({ cartItems: guestCart } as ShoppingCart); // ✅ Devolver carrito de invitados
    }
    return this.http.get<ShoppingCart>(`${this.apiUrl}/users/${this.userId}`);
  }

  addToCart(item: CartItem): Observable<ShoppingCart> {
    if (!this.userId) {
      // Si es un usuario invitado, solo actualiza el carrito local
      this.addToGuestCart(item);
      const guestCart = this.getGuestCart();
      return of({
        id: -1, // Un ID temporal para el carrito de invitados
        username: 'Invitado',
        cartItems: guestCart,
        status: 'Pendiente', // Estado predeterminado
        totalCartPrice: this.getTotal() // Calcular el total
      });
    }

    // Si es un usuario autenticado, realiza la llamada a la API
    return this.http.post<ShoppingCart>(`${this.apiUrl}/users/${this.userId}/add`, item)
      .pipe(tap(() => {
        this.loadShoppingCart(); // Recargar el carrito del usuario
        this.updateCartCount();
      }));
  }

  getTotal(): number {
    // Si el carrito está vacío, el total será 0
    const cart = this.userId ? this.cartItems.getValue() : this.getGuestCart();
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }


  getGuestCart(): CartItem[] {
    const cart = localStorage.getItem('guestCart');
    return cart ? JSON.parse(cart) : [];
  }

  saveGuestCart(cart: CartItem[]) {
    localStorage.setItem('guestCart', JSON.stringify(cart));
    this.updateCartCount();
    this.cartItems.next([...cart]); // Emitir cambio en el estado del carrito
  }

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

  removeCartItem(productId: number): Observable<ShoppingCart> {
  if (!this.userId) {
    // Si es un usuario invitado, solo actualiza el carrito local
    this.removeGuestCartItem(productId);
    const guestCart = this.getGuestCart();
    return of({
      id: -1, // Un ID temporal para el carrito de invitados
      username: 'Invitado',
      cartItems: guestCart,
      status: 'Pendiente', // Estado predeterminado
      totalCartPrice: this.getTotal() // Calcular el total
    });
  }

  // Si es un usuario autenticado, realiza la llamada a la API
  return this.http.delete<ShoppingCart>(`${this.apiUrl}/users/${this.userId}/remove/${productId}`)
    .pipe(tap(() => {
      this.loadShoppingCart(); // Recargar el carrito del usuario
      this.updateCartCount();
    }));
}


  removeGuestCartItem(productId: number) {
    let cart = this.getGuestCart().filter(cartItem => cartItem.product.id !== productId);
    this.saveGuestCart(cart);
  }

  private updateCartCount() {
    if (this.userId) {
      // 🔹 Cargar el carrito del usuario autenticado y contar los ítems
      this.getUserShoppingCart().subscribe(cart => {
        const totalItems = cart.cartItems?.reduce((sum: number, item: CartItem) => sum + item.quantity, 0) || 0;
        console.log('Total Items in Cart (User):', totalItems); // 🔍 Verificar en consola
        this.cartCount.next(totalItems);
      });
    } else {
      // 🔹 Si es invitado, contar los ítems localmente
      const cart = this.getGuestCart();
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      console.log('Total Items in Cart (Guest):', totalItems);
      this.cartCount.next(totalItems);
    }
  }

  updateCartItem(item: CartItem): Observable<ShoppingCart> {
    if (this.userId) {
      return this.http.put<ShoppingCart>(
        `${this.apiUrl}/users/${this.userId}/update/${item.product.id}`,
        { quantity: item.quantity }
      ).pipe(
        tap((updatedCart) => {
          this.cartItems.next(updatedCart.cartItems); // ✅ Actualiza la UI
          this.updateCartCount();
        }),
        catchError((error: any) => {
          console.error("Error al actualizar el carrito:", error);

          // ✅ Retornar el carrito actual en caso de error (para evitar que se rompa la UI)
          return of({
            id: this.userId,
            username: "Unknown",
            cartItems: this.cartItems.getValue(), // ✅ Mantiene los datos actuales
            status: "ACTIVE",
            totalCartPrice: this.cartItems.getValue().reduce((sum, i) => sum + i.totalPrice, 0),
          } as ShoppingCart);
        })
      );
    } else {
      let cart = this.getGuestCart().map(cartItem =>
        cartItem.product.id === item.product.id
          ? { ...cartItem, quantity: item.quantity, totalPrice: item.unitPrice * item.quantity } // ✅ Actualiza precio total
          : cartItem
      );

      this.saveGuestCart(cart);
      this.updateCartCount();
      this.cartItems.next(cart);

      // ✅ Retorna un carrito en formato `ShoppingCart` para invitados
      const guestCart: ShoppingCart = {
        id: 0,
        username: "Guest",
        cartItems: cart,
        status: "ACTIVE",
        totalCartPrice: cart.reduce((sum, i) => sum + i.totalPrice, 0),
      };

      return of(guestCart);
    }
  }

  loadShoppingCart(): void {
    if (this.userId) {
      // Carrito de usuario autenticado
      this.getUserShoppingCart().subscribe({
        next: (cart: ShoppingCart) => {
          this.cartItems.next(this.sortCartItems(cart.cartItems ?? []));
          this.updateCartCount(); // Actualiza el contador de productos
        },
        error: () => {
          this.cartItems.next([]);
          this.updateCartCount();
        }
      });
    } else {
      // Carrito de invitado
      const guestCart = this.getGuestCart();
      this.cartItems.next(this.sortCartItems(guestCart)); // Actualiza el carrito local para el invitado
      this.updateCartCount();

      // Crear un objeto ShoppingCart para el invitado
      const shoppingCartForGuest: ShoppingCart = {
        id: -1, // Usamos un ID temporal para el carrito de invitado
        username: 'Invitado',
        cartItems: guestCart,
        status: 'Pendiente',
        totalCartPrice: this.getTotal() // Calculamos el total para el carrito del invitado
      };

      // Emitir el carrito para el invitado
      this.cartItems.next(shoppingCartForGuest.cartItems);
    }
  }


  private sortCartItems(cartItems: CartItem[]) {
    return cartItems.sort((a, b) => a.product.id - b.product.id);
  }

  increaseQuantity(item: CartItem) {
    console.log('Aumentando cantidad para el producto:', item.product.name, 'Cantidad actual:', item.quantity);

    if (item.quantity < 99) {
      item.quantity++; // Aumenta la cantidad

      if (this.userId) {
        this.updateCartItem(item).subscribe(updatedCart => {
          console.log("✅ Carrito actualizado en el backend:", updatedCart);
          this.cartItems.next(updatedCart.cartItems); // ✅ Refresca los datos en la UI
          this.updateCartCount();
        });
      } else {
        const updatedCart = this.getGuestCart().map(cartItem =>
          cartItem.product.id === item.product.id ? item : cartItem
        );
        this.saveGuestCart(updatedCart);
      }
    } else {
      console.log('Cantidad máxima alcanzada para el producto:', item.product.name);
    }
  }


  decreaseQuantity(item: CartItem) {
    console.log('Disminuyendo cantidad para el producto:', item.product.name, 'Cantidad actual:', item.quantity);

    if (item.quantity > 1) {
      item.quantity--; // Reduce la cantidad

      if (this.userId) {
        this.updateCartItem(item).subscribe(updatedCart => {
          console.log("✅ Carrito actualizado en el backend:", updatedCart);
          this.cartItems.next(updatedCart.cartItems);
          this.updateCartCount();
        });
      } else {
        const updatedCart = this.getGuestCart().map(cartItem =>
          cartItem.product.id === item.product.id ? item : cartItem
        );
        this.saveGuestCart(updatedCart);
      }
    } else {
      console.log('Cantidad mínima alcanzada para el producto:', item.product.name);

      if (this.userId) {
        this.removeCartItem(item.product.id).subscribe(() => {
          const updatedCart = this.cartItems.getValue().filter(cartItem => cartItem.product.id !== item.product.id);
          this.cartItems.next(updatedCart);
          this.updateCartCount();
        });
      } else {
        this.removeGuestCartItem(item.product.id);
      }
    }
  }

  clearCart(): void {
    this.cartItems.next([]);  // 🔹 Vacía los productos en el carrito local
    this.cartCount.next(0);   // 🔹 Reinicia el contador del carrito

    if (this.userId) {
        // 🔹 Si el usuario está autenticado, limpiar también en el backend
        this.http.delete(`${this.apiUrl}/users/${this.userId}/clear`).subscribe({
            next: () => console.log("✅ Carrito de usuario autenticado limpiado en el backend"),
            error: (err) => console.error("❌ Error al limpiar el carrito en el backend:", err)
        });
    } else {
        // 🔹 Si es un usuario invitado, limpiar el carrito en localStorage
        localStorage.removeItem('guestCart');
    }
}

}

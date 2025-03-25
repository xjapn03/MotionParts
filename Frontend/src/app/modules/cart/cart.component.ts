import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingCartService } from '../../core/services/shoppingCart.service';
import { AuthService } from '../../core/services/auth.service';
import { CartItem } from '../../core/models/cartItem.model';
import { ShoppingCart } from '../../core/models/shoppingCart.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  imports: [CommonModule]
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  shoppingCart: ShoppingCart | null = null;
  cartItems: CartItem[] = [];
  cartItemCount = 0;
  user: { id?: number; username?: string } = {};
  private subscriptions: Subscription[] = [];

  constructor(
    private shoppingCartService: ShoppingCartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // 🔹 Suscribirse a cambios en la autenticación
    const authSub = this.authService.user$.subscribe((user) => {
      console.log('Usuario autenticado:', user); // Log de usuario autenticado
      if (user?.id) {
        // Usuario autenticado
        this.user = user;
        this.shoppingCartService.setUserId(user.id); // Establecer el ID del usuario
        this.shoppingCartService.loadShoppingCart(); // Cargar el carrito desde el backend

        // Obtener el carrito del usuario autenticado
        this.shoppingCartService.getUserShoppingCart().subscribe(cart => {
          console.log('Carrito del Usuario:', cart); // Log de carrito del usuario
          this.shoppingCart = cart; // 🔹 Asigna el carrito aquí
          this.cartItems = cart.cartItems; // Asigna los productos del carrito
        });
      } else {
        // Usuario invitado (sin ID de usuario)
        this.user = {};
        const guestCart = this.shoppingCartService.getGuestCart(); // Recupera el carrito del invitado
        console.log('Carrito de Invitado:', guestCart); // Log del carrito de invitado
        this.cartItems = guestCart; // Asigna los productos del carrito de invitado
        this.shoppingCart = {
          id: -1,  // Usar un ID temporal para el carrito del invitado
          username: 'Invitado',
          cartItems: guestCart,
          status: 'Pendiente',
          totalCartPrice: this.getTotal() // Calcular el total del carrito
        };
      }
    });

    // 🔹 Suscribirse a cambios en los productos del carrito
    const cartItemsSub = this.shoppingCartService.cartItems$.subscribe((items) => {
      console.log('Carrito actualizado en la suscripción:', items); // Log de los elementos del carrito
      this.cartItems = items;
    });

    // 🔹 Suscribirse a cambios en el contador de productos en el carrito
    const cartCountSub = this.shoppingCartService.cartCount$.subscribe((count) => {
      this.cartItemCount = count; // Actualiza el contador con el valor emitido
      console.log('Total Items in Cart:', this.cartItemCount); // Log del total de elementos en el carrito
    });

    // Guardar suscripciones para limpiar después
    this.subscriptions.push(authSub, cartItemsSub, cartCountSub);
  }

  emptyCart(): void {
    if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
      this.shoppingCartService.clearCart();
    }
  }

  // ✅ Métodos para modificar el carrito
  onRemoveCartItem(item: CartItem): void {
    this.shoppingCartService.removeCartItem(item.product.id).subscribe(() => {
      // El carrito se actualizará automáticamente con la emisión de cartItems$
      this.shoppingCartService.loadShoppingCart(); // Recargar el carrito para actualizar el contador
    });
  }

  onIncreaseQuantity(item: CartItem): void {
    console.log('Intentando aumentar la cantidad del producto:', item.product.name, 'Cantidad actual:', item.quantity); // Log de depuración
    this.shoppingCartService.increaseQuantity(item);
  }

  onDecreaseQuantity(item: CartItem): void {
    console.log('Intentando disminuir la cantidad del producto:', item.product.name, 'Cantidad actual:', item.quantity); // Log de depuración
    this.shoppingCartService.decreaseQuantity(item);
  }


  getTotal(): number {
    // Retorna el total calculado a partir de cartItems
    return this.cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  trackByItemId(index: number, item: CartItem): number {
    return item.product.id; // Utilizado para optimizar el renderizado de elementos
  }

  // 🚀 Evitar fugas de memoria con `ngOnDestroy`
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}


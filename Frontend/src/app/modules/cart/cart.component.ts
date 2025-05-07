import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ShoppingCartService } from '../../core/services/shoppingCart.service';
import { AuthService } from '../../core/services/auth.service';
import { CartItem } from '../../core/models/cartItem.model';
import { ShoppingCart } from '../../core/models/shoppingCart.model';
import { Subscription, finalize } from 'rxjs';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  shoppingCart: ShoppingCart | null = null;
  cartItems: CartItem[] = [];
  cartItemCount = 0;
  user: { id?: number; username?: string } = {};
  isLoading = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private shoppingCartService: ShoppingCartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Mostrar indicador de carga inicialmente
    this.isLoading = true;

    // 🔹 Suscribirse a cambios en la autenticación
    const authSub = this.authService.user$.subscribe((user) => {
      console.log('Usuario autenticado:', user);

      if (user?.id) {
        // Asegurarse de que user.id sea un número antes de asignarlo
        const userId = typeof user.id === 'string' ? Number(user.id) : user.id;

        // Usuario autenticado
        this.user = { id: userId, username: user.username };
        this.shoppingCartService.setUserId(userId); // Pasar userId como número
        this.loadUserCart();
      } else {
        // Usuario invitado (sin ID de usuario)
        this.user = {};
        this.loadGuestCart();
      }
    });

    // 🔹 Suscribirse a cambios en los productos del carrito
    const cartItemsSub = this.shoppingCartService.cartItems$.subscribe((items) => {
      console.log('Carrito actualizado en la suscripción:', items);
      this.cartItems = items;
      this.isLoading = false;
    });

    // 🔹 Suscribirse a cambios en el contador de productos en el carrito
    const cartCountSub = this.shoppingCartService.cartCount$.subscribe((count) => {
      this.cartItemCount = count;
      console.log('Total Items in Cart:', this.cartItemCount);
    });

    // Guardar suscripciones para limpiar después
    this.subscriptions.push(authSub, cartItemsSub, cartCountSub);
  }


  // Cargar carrito de usuario autenticado
  loadUserCart(): void {
    this.isLoading = true;
    this.shoppingCartService.loadShoppingCart();
    this.shoppingCartService.getUserShoppingCart()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(cart => {
        console.log('Carrito del Usuario:', cart);
        this.shoppingCart = cart;
        this.cartItems = cart.cartItems;
      });
  }

  // Cargar carrito de invitado
  loadGuestCart(): void {
    const guestCart = this.shoppingCartService.getGuestCart();
    console.log('Carrito de Invitado:', guestCart);
    this.cartItems = guestCart;
    this.shoppingCart = {
      id: -1,
      username: 'Invitado',
      cartItems: guestCart,
      status: 'Pendiente',
      totalCartPrice: this.getTotal()
    };
    this.isLoading = false;
  }

  // Vaciar el carrito
  emptyCart(): void {
    if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
      this.isLoading = true;
      this.shoppingCartService.clearCart();
    }
  }

  // Eliminar un producto del carrito
  onRemoveCartItem(item: CartItem): void {
    this.isLoading = true;
    this.shoppingCartService.removeCartItem(item.product.id!)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(() => {
        this.shoppingCartService.loadShoppingCart();
      });
  }

  // Aumentar la cantidad de un producto
  onIncreaseQuantity(item: CartItem): void {
    // Verificar si hay stock disponible
    if (item.product.stock === 0 || item.quantity >= item.product.stock) {
      return;
    }

    console.log('Aumentando cantidad del producto:', item.product.name, 'Cantidad actual:', item.quantity);
    this.isLoading = true;
    this.shoppingCartService.increaseQuantity(item);
    setTimeout(() => this.isLoading = false, 300); // Simular tiempo de procesamiento
  }

  // Disminuir la cantidad de un producto
  onDecreaseQuantity(item: CartItem): void {
    if (item.quantity <= 1) {
      return;
    }

    console.log('Disminuyendo cantidad del producto:', item.product.name, 'Cantidad actual:', item.quantity);
    this.isLoading = true;
    this.shoppingCartService.decreaseQuantity(item);
    setTimeout(() => this.isLoading = false, 300); // Simular tiempo de procesamiento
  }

  // Obtener subtotal (sin impuestos)
  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  // Calcular impuestos
  getImportFees(): number {
    return this.getSubtotal() * 0.22; // 22% de impuestos
  }

  // Obtener total (con impuestos)
  getTotal(): number {
    return this.getSubtotal() + this.getImportFees();
  }

  // Verificar si hay productos no disponibles (sin stock)
  hasUnavailableItems(): boolean {
    return this.cartItems.some(item => item.product.stock === 0);
  }

  // Trackear los items del carrito para optimizar el rendimiento
  trackByItemId(index: number, item: CartItem): number {
    return item.product.id!;

  }

  // Proceder al checkout
  onCheckout(): void {
    // No permitir checkout si hay productos sin stock
    if (this.hasUnavailableItems()) {
      alert('Elimina los productos sin stock para continuar');
      return;
    }

    this.router.navigate(['/checkout']);
  }

  // Evitar fugas de memoria
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
    
}

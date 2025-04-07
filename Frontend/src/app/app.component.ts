import { AuthResponse } from './core/models/login.model';
import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { ShoppingCartService } from './core/services/shoppingCart.service';
import { CartItem } from './core/models/cartItem.model';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'nombre-del-proyecto-angular';
  user: { id?: number; username?: string; roles?: { name: string }[] } = {};
  isDropdownOpen = false;
  isCartModalOpen = false;
  isMobileMenuOpen = false;
  isLoading = false;
  
  cartItemCount = 0;
  cartItems$: Observable<CartItem[]>;
  private cartItems: CartItem[] = [];
  private subscriptions: Subscription[] = [];
  
  private authService = inject(AuthService);
  private router = inject(Router);
  private shoppingCartService = inject(ShoppingCartService);
  
  constructor() {
    this.cartItems$ = this.shoppingCartService.cartItems$;
  }
  
  ngOnInit() {
    // Inicializar carrito para invitados
    this.shoppingCartService.initializeGuestCart();
    
    // Suscribirse a cambios en la autenticación
    const authSub = this.authService.user$.subscribe((authResponse: AuthResponse | null) => {
      if (authResponse) {
        this.user = {
          id: authResponse.id,
          username: authResponse.username,
          roles: authResponse.roles ?? [],
        };
        this.shoppingCartService.setUserId(authResponse.id);
      } else {
        this.user = { id: undefined, username: '', roles: [] };
      }
      // Cargar carrito según el estado de autenticación
      this.shoppingCartService.loadShoppingCart();
    });
    
    // Actualizar contador del carrito
    const countSub = this.shoppingCartService.cartCount$.subscribe(count => {
      this.cartItemCount = count;
    });
    
    // Guardar items del carrito localmente para cálculos
    const itemsSub = this.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
    
    this.subscriptions.push(authSub, countSub, itemsSub);
  }
  
  // Método para calcular subtotal
  getSubtotal(): number {
    return this.cartItems?.reduce((total, item) => total + item.product.price * item.quantity, 0) || 0;
  }
  
  // Método para calcular impuestos
  getTaxes(): number {
    return this.getSubtotal() * 0.22; // 22% de impuestos
  }
  
  // Método para calcular total con impuestos
  getTotal(): number {
    return this.getSubtotal() + this.getTaxes();

  }
  
  // Helper para verificar si hay productos sin stock
  hasUnavailableItems(): boolean {
    return this.cartItems?.some(item => item.product.stock === 0) || false;
  }
  
  // Tracked para optimizar el rendimiento
  trackById(index: number, item: CartItem): number {
    return item.product.id;
  }
  
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  
  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
    this.isDropdownOpen = false;
  }
  
  goToLogin() {
    this.router.navigate(['/login']);
  }
  
  openCartModal() {
    // No abrir el modal si el carrito está vacío
    if (this.cartItemCount > 0) {
      this.isCartModalOpen = true;
      // Añadir clase al body para prevenir scroll
      document.body.classList.add('overflow-hidden');
    } else {
      // Opcionalmente, redirigir a la página de productos
      this.router.navigate(['/products']);
    }
  }
  
  closeCartModal() {
    this.isCartModalOpen = false;
    // Eliminar clase del body
    document.body.classList.remove('overflow-hidden');
  }
  
  goToCart() {
    this.closeCartModal();
    this.router.navigate(['/cart']);
  }
  
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
  
  // Getter para verificar si el usuario es ADMIN
  get isAdmin(): boolean {
    return this.user?.roles?.some(role => role.name === 'ADMIN') ?? false;
  }
  
  // Aumentar cantidad
  increaseQuantity(item: CartItem) {
    // No aumentar si no hay stock disponible
    if (item.product.stock === 0 || item.quantity >= item.product.stock) {
      return;
    }
    
    this.isLoading = true;
    this.shoppingCartService.increaseQuantity(item);
    setTimeout(() => this.isLoading = false, 300); // Simular tiempo de respuesta
  }
  
  // Disminuir cantidad
  decreaseQuantity(item: CartItem) {
    // No disminuir por debajo de 1
    if (item.quantity <= 1) {
      return;
    }
    
    this.isLoading = true;
    this.shoppingCartService.decreaseQuantity(item);
    setTimeout(() => this.isLoading = false, 300); // Simular tiempo de respuesta
  }
  
  // Eliminar ítem del carrito
  removeItem(item: CartItem) {
    this.isLoading = true;
    this.shoppingCartService.removeCartItem(item.product.id).subscribe(() => {
      this.shoppingCartService.loadShoppingCart();
      this.isLoading = false;
    });
  }
  
  // Limpiar suscripciones al destruir el componente
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}

import { AuthResponse } from './core/models/login.model';
import { Component, OnInit, inject } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { ShoppingCartService } from './core/services/shoppingCart.service';
import { CartItem } from './core/models/cartItem.model';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule], // Importar módulos necesarios
})
export class AppComponent implements OnInit {
  title = 'nombre-del-proyecto-angular';
  user: { id?: number; username?: string; roles?: { name: string }[] } = {};
  isDropdownOpen = false; // Estado del menú desplegable
  isCartModalOpen = false; // Estado del modal del carrito
  isMobileMenuOpen = false;
  cartItemCount = 0; // Contador de elementos en el carrito
  cartItems$: Observable<CartItem[]> = new Observable<CartItem[]>();

  private authService = inject(AuthService);
  private router = inject(Router);
  private shoppingCartService = inject(ShoppingCartService);

  ngOnInit() {
    this.shoppingCartService.initializeGuestCart();
    this.cartItems$ = this.shoppingCartService.cartItems$; // Suscribirse al carrito en tiempo real

    // ✅ Actualizar la información del usuario autenticado
    this.authService.user$.subscribe((authResponse: AuthResponse | null) => {
      if (authResponse) {
        this.user = {
          id: authResponse.id,
          username: authResponse.username,
          roles: authResponse.roles ?? [], // ✅ Previene valores undefined
        };
        this.shoppingCartService.setUserId(authResponse.id); // ✅ Asigna el ID del usuario
      } else {
        this.user = { id: undefined, username: '', roles: [] };
      }

      // ✅ Llamar al servicio para cargar el carrito
      this.shoppingCartService.loadShoppingCart();
    });

    // ✅ Actualizar el contador del carrito en tiempo real
    this.shoppingCartService.cartCount$.subscribe(count => {
      this.cartItemCount = count;
    });
  }

  getTotal(cartItems: CartItem[] = []): number {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
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
    this.cartItems$.subscribe(items => {
      if (items.length > 0) {
        this.isCartModalOpen = true;
      } else {
        alert("Tu carrito está vacío.");
      }
    });
  }

  closeCartModal() {
    this.isCartModalOpen = false;
  }

  goToCart() {
    this.closeCartModal();
    this.router.navigate(['/cart']);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  // ✅ Getter para verificar si el usuario es ADMIN
  get isAdmin(): boolean {
    return this.user?.roles?.some(role => role.name === 'ADMIN') ?? false;
  }

  increaseQuantity(item: CartItem) {
    this.shoppingCartService.increaseQuantity(item);
  }

  decreaseQuantity(item: CartItem) {
    this.shoppingCartService.decreaseQuantity(item);
  }

}

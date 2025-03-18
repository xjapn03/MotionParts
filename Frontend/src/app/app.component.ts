import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { ShoppingCartService } from './core/services/shoppingCart.service';
import { ShoppingCart } from './core/models/shoppingCart.model';
import { CartItem } from './core/models/cartItem.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule], // Importar módulos necesarios
})
export class AppComponent implements OnInit {
  title = 'nombre-del-proyecto-angular';
  user: { username?: string; image?: string } = {}; // Definir user
  isDropdownOpen = false; // Estado del menú desplegable
  isCartModalOpen = false; // Estado del modal del carrito
  cartItemCount = 0; // Contador de elementos en el carrito
  cartItems: CartItem[] = []; // Ahora es un array dinámico basado en datos reales

  private authService = inject(AuthService);
  private router = inject(Router);
  private shoppingCartService = inject(ShoppingCartService);

  ngOnInit() {
    // Suscribirse al usuario autenticado
    this.authService.user$.subscribe((user: any) => {
      this.user = user || {}; // Se actualiza el usuario automáticamente
    });

    // Cargar el carrito desde el backend
    this.loadShoppingCart();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen; // Alternar entre abierto/cerrado
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirigir a la página de login
    this.isDropdownOpen = false; // Cerrar el menú al cerrar sesión
  }

  goToLogin() {
    this.router.navigate(['/login']); // Redirigir de forma correcta
  }

  openCartModal() {
    if (this.cartItems.length > 0) {
      this.isCartModalOpen = true;
    }
  }

  closeCartModal() {
    this.isCartModalOpen = false;
  }

  goToCart() {
    this.closeCartModal();
    this.router.navigate(['/cart']);
  }

  private loadShoppingCart() {
    this.authService.user$.subscribe((user: any) => {
      if (user?.id) {  // Asegurar que el usuario tiene un ID
        this.shoppingCartService.getUserShoppingCart(user.id).subscribe({
          next: (cart: ShoppingCart) => {
            this.cartItems = cart.cartItems;
            this.updateCartCount();
          },
          error: (error) => {
            console.error('Error al obtener el carrito', error);
          }
        });
      }
    });
  }

  private updateCartCount() {
    this.cartItemCount = this.cartItems.length;
  }
}

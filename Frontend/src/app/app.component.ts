import { AuthResponse } from './core/models/login.model';
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
  user: { username?: string; roles?: { name: string }[] } = {};
  isDropdownOpen = false; // Estado del menú desplegable
  isCartModalOpen = false; // Estado del modal del carrito
  cartItemCount = 0; // Contador de elementos en el carrito
  cartItems: CartItem[] = []; // Ahora es un array dinámico basado en datos reales

  private authService = inject(AuthService);
  private router = inject(Router);
  private shoppingCartService = inject(ShoppingCartService);

  ngOnInit() {
    this.shoppingCartService.initializeGuestCart();

    // ✅ Actualizar la información del usuario autenticado
    this.authService.user$.subscribe((authResponse: AuthResponse | null) => {
      if (authResponse) {
        this.user = {
          username: authResponse.username,
          roles: authResponse.roles ? authResponse.roles : [], // ✅ Evita undefined
        };

        console.log('Roles del usuario:', this.user.roles?.map(role => role.name) || []); // ✅ Evita error
      } else {
        this.user = {
          username: '',
          roles: [],
        };
      }
    });

    // ✅ Suscribirse al contador del carrito para actualizar en tiempo real
    this.shoppingCartService.cartCount$.subscribe(count => {
      this.cartItemCount = count;
    });

    // ✅ Cargar el carrito al iniciar la aplicación
    this.loadShoppingCart();
  }


  private loadShoppingCart() {
    this.authService.user$.subscribe((user: any) => {
      if (user?.id) {
        // ✅ Cargar carrito desde el backend si el usuario está autenticado
        this.shoppingCartService.getUserShoppingCart(user.id).subscribe({
          next: (cart: ShoppingCart) => {
            this.cartItems = cart?.cartItems ?? []; // ✅ Previene errores si `cartItems` es undefined
            this.updateCartCount();
          },
          error: (error) => {
            console.error('❌ Error al obtener el carrito del usuario:', error);
            this.cartItems = [];
            this.updateCartCount();
          }
        });
      } else {
        // ✅ Cargar carrito desde localStorage para usuarios no autenticados
        this.cartItems = [...this.shoppingCartService.getGuestCart()]; // ✅ Clonar para evitar mutaciones accidentales
        this.updateCartCount();
      }
    });
  }


  // ✅ Getter para verificar si el usuario es ADMIN
  get isAdmin(): boolean {
    return this.user?.roles?.some(role => role.name === 'ADMIN') ?? false;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen; // Alternar entre abierto/cerrado
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']); // Redirigir a la página de login
    this.isDropdownOpen = false; // Cerrar el menú al cerrar sesión
  }

  goToLogin() {
    this.router.navigate(['/login']); // Redirigir de forma correcta
  }

  openCartModal() {
    if (this.cartItems.length > 0) {
      this.isCartModalOpen = true;
    } else {
      alert("Tu carrito está vacío.");
    }
  }


  closeCartModal() {
    this.isCartModalOpen = false;
  }

  goToCart() {
    this.closeCartModal();
    this.router.navigate(['/cart']);
  }



  private updateCartCount() {
    this.cartItemCount = this.cartItems.length;
  }
}

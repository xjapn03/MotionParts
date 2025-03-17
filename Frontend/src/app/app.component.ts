import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from './core/services/auth.service';

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

  private authService = inject(AuthService);
  private router = inject(Router);

  cartItems = [
    { name: 'Producto 1', price: 20 },
    { name: 'Producto 2', price: 35 },
    { name: 'Producto 3', price: 15 }
  ];

  ngOnInit() {
    // Suscribirse al usuario autenticado
    this.authService.user$.subscribe((user: any) => {
      this.user = user || {}; // Se actualiza el usuario automáticamente
    });

    // Actualizar el contador del carrito
    this.updateCartCount();
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

  // Evita la redirección y abre el modal del carrito
  openCartModal() {
    if (this.cartItems.length > 0) {
      this.isCartModalOpen = true;
    }
  }  

  closeCartModal() {
    this.isCartModalOpen = false;
  }

  // Cierra el modal y redirige al carrito
  goToCart() {
    this.closeCartModal();
    this.router.navigate(['/cart']);
  }

  updateCartCount() {
    this.cartItemCount = this.cartItems.length;
  }
}


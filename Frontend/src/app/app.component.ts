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
  isDropdownOpen = false; // Estado del menú

  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.authService.user$.subscribe((user: any) => { // Especificamos el tipo explícitamente
      this.user = user || {}; // Se actualiza el usuario automáticamente
    });
  }


  //logica del carrito pendiente ==========
  cartItemCount = 0

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
}

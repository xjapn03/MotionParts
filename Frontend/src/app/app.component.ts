import { Component, inject } from '@angular/core';
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
export class AppComponent {
  title = 'nombre-del-proyecto-angular';
  user: { username?: string; image?: string } = {}; // Definir user

  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.getUserInfo();
  }

  getUserInfo() {
    const token = this.authService.getToken();
    if (token) {
      // Aquí deberías decodificar el token o hacer una petición al backend
      this.user = { username: 'Usuario', image: 'assets/default-user.png' };
    }
  }

  logout() {
    this.authService.logout();
    this.user = {};
    this.router.navigate(['/login']); // Redirigir a la página de login
  }

  goToLogin() {
    this.router.navigate(['/login']); // Redirigir de forma correcta
  }
}

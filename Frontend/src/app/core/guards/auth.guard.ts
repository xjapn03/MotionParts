import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.authService.getUser();
    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    const isAdmin = user.roles?.some(role => role.name === 'ADMIN');
    if (!isAdmin) {
      this.router.navigate(['/']); // Redirige a home si no es admin
      return false;
    }

    return true; // Permite acceso a /admin
  }
}

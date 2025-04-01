import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.authService.getUser();

    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    const isAdminRoute = state.url.startsWith('/admin');
    const isAdmin = user.roles?.some(role => role.name === 'ADMIN');

    if (isAdminRoute && !isAdmin) {
      this.router.navigate(['/']); // Solo bloquea acceso a /admin si no es admin
      return false;
    }

    return true; // Permite acceso a cualquier otra ruta autenticada
  }
}
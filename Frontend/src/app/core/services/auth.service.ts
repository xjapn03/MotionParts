import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequest, AuthResponse, Role } from '../models/login.model'; // 🔥 Importamos Role
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { ShoppingCartService } from './shoppingCart.service'; // ✅ Importar el servicio de carrito

interface DecodedToken {
  sub: string;
  roles: string[];
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth/login';
  private userSubject = new BehaviorSubject<AuthResponse | null>(this.getUserFromStorage());
  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private shoppingCartService: ShoppingCartService // ✅ Inyectar servicio de carrito
  ) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrl, credentials).pipe(
      tap((response: AuthResponse) => {
        const decoded: DecodedToken = jwtDecode(response.token);
        console.log('Token decodificado:', decoded); // 🛠 Debug

        // 🔥 Transformar roles de string[] a Role[]
        const formattedRoles: Role[] = decoded.roles.map((roleName, index) => ({
          id: index, // Si el backend no devuelve IDs, asignamos índices temporales
          name: roleName
        }));

        const userWithRoles: AuthResponse = { ...response, roles: formattedRoles };

        this.saveSession(userWithRoles);
      })
    );
  }

  private saveSession(authResponse: AuthResponse): void {
    localStorage.setItem('token', authResponse.token);
    localStorage.setItem('user', JSON.stringify(authResponse));
    this.userSubject.next(authResponse);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getUserFromStorage(): AuthResponse | null {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  getUser(): AuthResponse | null {
    return this.userSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    // 🔹 1. Limpiar el almacenamiento local
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // 🔹 2. Notificar que el usuario cerró sesión
    this.userSubject.next(null);

    // 🔹 3. Redirigir y recargar la página para actualizar el estado del carrito y el contador
    this.router.navigate(['/home']).then(() => {
        window.location.reload();
    });
}


}

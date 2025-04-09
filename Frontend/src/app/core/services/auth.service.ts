import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequest, AuthResponse, Role } from '../models/login.model';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { ShoppingCartService } from './shoppingCart.service';

// Token decodificado
interface DecodedToken {
  sub: string;
  roles: string[];
  iat: number;
  exp: number;
}

// Interfaz para el registro
interface RegisterRequest {
  user: {
    username: string;
    email: string;
    password: string;
  };
  userInfo: {
    type: string;
    documentType: string;
    documentNumber: string;
    documentExp: string;
    expCountry: string;
    expRegion: string;
    expCity: string;
    firstName: string;
    middleName: string;
    lastName: string;
    secondLastName: string;
    otherNames: string;
    legalName: string;
    email: string;
    country: string;
    region: string;
    city: string;
    address: string;
    addressDetail: string;
    postalCode: string;
    phone: string;
    phone2: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginUrl = 'http://localhost:8080/api/auth/login';
  private registerUrl = 'http://localhost:8080/api/auth/register';
  private userSubject = new BehaviorSubject<AuthResponse | null>(this.getUserFromStorage());
  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private shoppingCartService: ShoppingCartService
  ) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.loginUrl, credentials).pipe(
      tap((response: AuthResponse) => {
        const decoded: DecodedToken = jwtDecode(response.token);
        const formattedRoles: Role[] = decoded.roles.map((roleName, index) => ({
          id: index,
          name: roleName
        }));

        const userWithRoles: AuthResponse = { ...response, roles: formattedRoles };
        this.saveSession(userWithRoles);
      })
    );
  }

  registerUserWithInfo(data: RegisterRequest): Observable<any> {
    return this.http.post<any>(this.registerUrl, data);
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/home']).then(() => {
      window.location.reload();
    });
  }
}

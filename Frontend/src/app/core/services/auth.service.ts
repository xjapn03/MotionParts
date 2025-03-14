import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { LoginRequest, AuthResponse } from '../models/login.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth/login'; // URL del backend
  private userSubject = new BehaviorSubject<any>(this.getUser()); // Estado del usuario
  user$ = this.userSubject.asObservable(); // Observable para detectar cambios en el usuario


  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrl, credentials);
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  saveUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  getUser(): any {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null); // Notificamos que el usuario ha cerrado sesión
  }
}

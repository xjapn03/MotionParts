import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Role } from '../models/login.model';
import { UserInfo } from '../models/user-info.model';
import { RegisterRequest } from '../models/register-request.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      catchError(this.handleError) // Manejo de errores
    );
  }

  // Obtener un usuario por su ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError) // Manejo de errores
    );
  }

  // Crear nuevo usuario
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar usuario existente
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar la información del usuario autenticado
  // Actualizar la información del usuario (autenticado o como admin)
  updateUserInfo(userInfo: any, userId?: number): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('Token no disponible'));
    }

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    const url = userId
      ? `http://localhost:8080/api/user-info/admin/${userId}`  // Modo admin
      : `http://localhost:8080/api/user-info/me`;              // Modo usuario

    return this.http.put<any>(url, userInfo, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar usuario
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener todos los roles disponibles
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>('http://localhost:8080/api/roles').pipe(
      catchError(this.handleError) // Manejo de errores
    );
  }

  registerUserWithInfo(request: RegisterRequest): Observable<any> {
    return this.http.post<any>('http://localhost:8080/api/auth/register', request).pipe(
      catchError(this.handleError)
    );
  }

  // Método para manejar errores en las solicitudes HTTP
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Algo salió mal; por favor intenta de nuevo más tarde.';
    if (error.error instanceof ErrorEvent) {
      // Errores del cliente
      errorMessage = `Error en la solicitud: ${error.error.message}`;
    } else {
      // Errores del servidor
      errorMessage = `Código de error: ${error.status}, Mensaje: ${error.message}`;
    }
    console.error(errorMessage); // Imprimir en la consola
    return throwError(errorMessage); // Lanzar el error
  }
}

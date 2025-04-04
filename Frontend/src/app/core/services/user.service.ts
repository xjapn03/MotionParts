import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Role } from '../models/login.model';


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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'  // Esto asegura que el servicio esté disponible a nivel global
})
export class PasswordRecoveryService {

  private apiUrl = 'http://localhost:3000/api/password-recovery'; // URL de tu API

  constructor(private http: HttpClient) { }

  // Método para enviar la solicitud de recuperación de contraseña
  recoverPassword(email: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { email });
  }
}


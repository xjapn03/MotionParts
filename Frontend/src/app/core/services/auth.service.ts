import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequest, AuthResponse, Role } from '../models/login.model';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { UserInfo } from '../models/user-info.model';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


// Token decodificado
interface DecodedToken {
  sub: string;
  roles: string[];
  userId: number; // <-- Agregar esto
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
  private userInfoUrl = 'http://localhost:8080/api/user-info/me';  // URL de UserInfo
  private userSubject = new BehaviorSubject<AuthResponse | null>(this.getUserFromStorage());
  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  generateGuestId(): string {
    // Aquí puedes utilizar cualquier método para generar un ID único
    return 'guest-' + Math.random().toString(36).substr(2, 9); // Ejemplo de ID único
  }

  initializeGuestSession() {
    const guestId = localStorage.getItem('guestId');
    if (!guestId) {
      const newGuestId = this.generateGuestId();
      localStorage.setItem('guestId', newGuestId);
    }
  }


  login(credentials: LoginRequest): Observable<AuthResponse> {
    console.log("Enviando credenciales de login: ", credentials);  // Verifica si se está enviando correctamente

    return this.http.post<AuthResponse>(this.loginUrl, credentials).pipe(
      tap((response: AuthResponse) => {
        const decoded: DecodedToken = jwtDecode(response.token);

        // Verifica si el userId está presente en el token decodificado
        console.log("Decoded token: ", decoded);  // Agrega este log para depurar

        const formattedRoles: Role[] = decoded.roles.map((roleName, index) => ({
          id: index,
          name: roleName
        }));

        const userWithRoles: AuthResponse = { ...response, roles: formattedRoles };

        // Imprimir el token recibido
        console.log("Token recibido desde el backend: ", response.token);

        // Verifica que userId esté en el token
        console.log("UserId desde el token: ", decoded.userId);  // Asegúrate de que esto tenga el valor correcto

        this.saveSession(userWithRoles);
      })
    );
  }


//UserInfo
  getUserInfo(): Observable<UserInfo> {
    const token = localStorage.getItem('token');  // Obtener el token de localStorage
    if (!token) {
      return throwError(() => new Error('Token no disponible'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<UserInfo>('http://localhost:8080/api/user-info/me', { headers })
      .pipe(catchError(this.handleError));
  }

  // Método para actualizar la información del usuario
  updateUserInfo(userInfo: UserInfo): Observable<UserInfo> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('Token no disponible'));
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<UserInfo>(this.userInfoUrl, userInfo, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  
  private handleError(error: any): Observable<never> {
    console.error('Error al actualizar userInfo:', error);
    return throwError(() => error);
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
    if (userData) {
      return JSON.parse(userData); // Si el usuario está en localStorage, lo devolvemos
    }

    // No devolvemos nada si no hay usuario real
    return null;
  }

  isGuest(): boolean {
    const guestId = localStorage.getItem('guestId');
    const user = this.getUser();
    return !user && !!guestId;
  }



  getGuestId(): string | null {
    return localStorage.getItem('guestId');
  }

  getUser(): AuthResponse | null {
    // Primero verifica si hay un usuario autenticado
    const user = this.userSubject.value;
    if (user) {
      return user; // Si existe un usuario autenticado, lo devuelve
    }

    // Si no hay usuario autenticado, devuelve el ID de invitado
    const guestId = this.getGuestId();  // Debería haber un guestId ya inicializado
    if (guestId) {
      return {
        id: guestId,  // Este será un string generado
        token: '',  // El invitado no tiene token
        username: '', // El invitado no tiene nombre de usuario
        email: '', // El invitado no tiene email
        roles: [] // Los roles de un invitado están vacíos
      };
    }

    return null; // Si no hay ni usuario autenticado ni ID de invitado, retorna null
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

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common'; // Importa NgIf
import { AuthService } from '../../../core/services/auth.service';
import { RouterModule } from '@angular/router'; // 👈 importa esto también

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule] // ✅ agrega RouterModule aquí
})

export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          // ✅ Ya no es necesario llamar a `saveToken()` y `saveUser()`
          console.log('Inicio de sesión exitoso:', response);

          this.router.navigate(['/home']); // Redirigir al home
        },
        error: () => {
          this.errorMessage = 'Usuario o contraseña incorrectos';
        },
      });
    }
  }

  // Método para iniciar sesión con Google
  signInWithGoogle(): void {
    // Redirección simple a la página de inicio de sesión de Google
    window.location.href = 'https://accounts.google.com/signin';
    
    // Para una implementación OAuth completa, usarías:
    // this.authService.signInWithGoogle();
  }
  
  // Método para iniciar sesión con Facebook
  signInWithFacebook(): void {
    // Redirección simple a la página de inicio de sesión de Facebook
    window.location.href = 'https://www.facebook.com/login';
    
    // Para una implementación OAuth completa, usarías:
    // this.authService.signInWithFacebook();
  }
}

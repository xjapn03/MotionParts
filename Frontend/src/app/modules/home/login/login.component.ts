import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common'; // Importa NgIf
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [NgIf, ReactiveFormsModule] // Corrige los imports en un solo array
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
          this.authService.saveToken(response.token);

          // Simulando un usuario real, en producción debería venir desde el backend
          const userData = { username: this.loginForm.value.username, image: 'assets/default-user.png' };
          this.authService.saveUser(userData);

          this.router.navigate(['/home']); // Redirigir al home
        },
        error: () => {
          this.errorMessage = 'Usuario o contraseña incorrectos';
        },
      });
    }
  }
}


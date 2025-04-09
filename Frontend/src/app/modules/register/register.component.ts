import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

interface User {
  username: string;
  email: string;
  password: string;
}

interface UserInfo {
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
}

interface RegisterRequest {
  user: User;
  userInfo: UserInfo;
}

@Component({
  selector: 'app-register',
  standalone: true, // 👈 MUY IMPORTANTE
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, FormsModule], // 👈 Aquí se importa FormsModule
})
export class RegisterComponent {
  form: RegisterRequest = {
    user: {
      username: '',
      email: '',
      password: ''
    },
    userInfo: {
      type: '',
      documentType: '',
      documentNumber: '',
      documentExp: '',
      expCountry: '',
      expRegion: '',
      expCity: '',
      firstName: '',
      middleName: '',
      lastName: '',
      secondLastName: '',
      otherNames: '',
      legalName: '',
      email: '',
      country: '',
      region: '',
      city: '',
      address: '',
      addressDetail: '',
      postalCode: '',
      phone: '',
      phone2: ''
    }
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.authService.registerUserWithInfo(this.form).subscribe({
      next: (res) => {
        console.log('Usuario registrado exitosamente', res);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error en el registro', err);
      }
    });
  }
}

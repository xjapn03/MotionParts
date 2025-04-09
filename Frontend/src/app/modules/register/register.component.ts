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
  activeTab: string = 'cuenta';
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

  previousTab: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  setActiveTab(tabId: string) {
    this.previousTab = this.activeTab;
    this.activeTab = tabId;
  }

  continue() {
    if (this.activeTab === 'cuenta') {
      this.activeTab = 'personal';
    } else if (this.activeTab === 'personal') {
      this.activeTab = 'contacto';
    }
  }

  // Método para ir atrás
  goBack() {
    this.activeTab = this.previousTab;
  }


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
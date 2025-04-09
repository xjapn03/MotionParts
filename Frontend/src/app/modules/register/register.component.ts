import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

interface User {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
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
  companyName: string;
  nit: string;
  legalRepresentative: string;
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
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class RegisterComponent {
  activeTab: string = 'cuenta';
  previousTab: string = '';
  accountForm: FormGroup;
  personalForm: FormGroup;
  contactForm: FormGroup;
  formSubmitted: boolean = false;
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    // Inicializar formularios con validaciones
    this.accountForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });

    this.personalForm = this.fb.group({
      type: ['natural', Validators.required],
      documentType: ['', Validators.required],
      documentNumber: ['', Validators.required],
      documentExp: ['', Validators.required],
      expCountry: ['', Validators.required],
      expRegion: [''],  // Ya no es obligatorio
      expCity: [''],    // Ya no es obligatorio
      firstName: ['', this.conditionalValidator(() => this.isPersonaNatural(), Validators.required)],
      middleName: [''],
      lastName: ['', this.conditionalValidator(() => this.isPersonaNatural(), Validators.required)],
      secondLastName: [''],
      otherNames: [''],
      legalName: [''],
      companyName: ['', this.conditionalValidator(() => !this.isPersonaNatural(), Validators.required)],
      nit: ['', this.conditionalValidator(() => !this.isPersonaNatural(), Validators.required)],
      legalRepresentative: ['', this.conditionalValidator(() => !this.isPersonaNatural(), Validators.required)]
    });

    this.contactForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      country: ['', Validators.required],
      region: [''],     // Ya no es obligatorio
      city: ['', Validators.required],
      address: ['', Validators.required],
      addressDetail: [''],
      postalCode: [''], // Ya no es obligatorio
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{10,15}$/)]],
      phone2: ['']
    });
  }

  // Validador personalizado para verificar si las contraseñas coinciden
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  // Validador condicional basado en una función
  conditionalValidator(condition: () => boolean, validator: any) {
    return (control: any) => {
      if (!condition()) {
        return null;
      }
      return validator(control);
    };
  }
  
  isPersonaNatural(): boolean {
    return this.personalForm?.get('type')?.value === 'natural';
  }

  // Actualizar validaciones cuando cambia el tipo de persona
  onPersonTypeChange() {
    // Resetear campos específicos según el tipo
    if (this.isPersonaNatural()) {
      this.personalForm.get('companyName')?.setValue('');
      this.personalForm.get('nit')?.setValue('');
      this.personalForm.get('legalRepresentative')?.setValue('');
    } else {
      this.personalForm.get('firstName')?.setValue('');
      this.personalForm.get('lastName')?.setValue('');
    }
    
    // Actualizar validaciones
    Object.keys(this.personalForm.controls).forEach(key => {
      this.personalForm.get(key)?.updateValueAndValidity();
    });
  }

  setActiveTab(tabId: string) {
    // Solo permitir cambio si el formulario actual es válido
    if (this.canProceed()) {
      this.previousTab = this.activeTab;
      this.activeTab = tabId;
    } else {
      this.formSubmitted = true;
    }
  }

  canProceed(): boolean {
    if (this.activeTab === 'cuenta') {
      return this.accountForm.valid;
    } else if (this.activeTab === 'personal') {
      return this.personalForm.valid;
    }
    return true;
  }

  continue() {
    if (this.activeTab === 'cuenta' && this.accountForm.valid) {
      this.activeTab = 'personal';
    } else if (this.activeTab === 'personal' && this.personalForm.valid) {
      this.activeTab = 'contacto';
    } else {
      this.formSubmitted = true;
    }
  }

  goBack() {
    if (this.activeTab === 'personal') {
      this.previousTab = 'cuenta';
      this.activeTab = 'cuenta';
    } else if (this.activeTab === 'contacto') {
      this.previousTab = 'personal';
      this.activeTab = 'personal';
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  onSubmit() {
    this.formSubmitted = true;
    
    if (this.accountForm.valid && this.personalForm.valid && this.contactForm.valid) {
      // Preparar objeto para enviar
      const registerData: RegisterRequest = {
        user: {
          username: this.accountForm.get('username')?.value,
          email: this.accountForm.get('email')?.value,
          password: this.accountForm.get('password')?.value,
          confirmPassword: this.accountForm.get('confirmPassword')?.value
        },
        userInfo: {
          type: this.personalForm.get('type')?.value,
          documentType: this.personalForm.get('documentType')?.value,
          documentNumber: this.personalForm.get('documentNumber')?.value,
          documentExp: this.personalForm.get('documentExp')?.value,
          expCountry: this.personalForm.get('expCountry')?.value,
          expRegion: this.personalForm.get('expRegion')?.value,
          expCity: this.personalForm.get('expCity')?.value,
          firstName: this.personalForm.get('firstName')?.value,
          middleName: this.personalForm.get('middleName')?.value,
          lastName: this.personalForm.get('lastName')?.value,
          secondLastName: this.personalForm.get('secondLastName')?.value,
          otherNames: this.personalForm.get('otherNames')?.value,
          legalName: this.personalForm.get('legalName')?.value,
          companyName: this.personalForm.get('companyName')?.value,
          nit: this.personalForm.get('nit')?.value,
          legalRepresentative: this.personalForm.get('legalRepresentative')?.value,
          email: this.contactForm.get('email')?.value,
          country: this.contactForm.get('country')?.value,
          region: this.contactForm.get('region')?.value,
          city: this.contactForm.get('city')?.value,
          address: this.contactForm.get('address')?.value,
          addressDetail: this.contactForm.get('addressDetail')?.value,
          postalCode: this.contactForm.get('postalCode')?.value,
          phone: this.contactForm.get('phone')?.value,
          phone2: this.contactForm.get('phone2')?.value
        }
      };

      this.authService.registerUserWithInfo(registerData).subscribe({
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
}
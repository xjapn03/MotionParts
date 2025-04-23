import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PasswordRecoveryService } from '../../core/services/password-recovery.service';
import { Router } from '@angular/router'; // Importar Router

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./password-recovery.component.css']
})
export class PasswordRecoveryComponent implements OnInit {
  passwordRecoveryForm!: FormGroup; // 👈 Aquí se aplicó el operador `!`
  isSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private passwordRecoveryService: PasswordRecoveryService,
    private router: Router // Inyectamos Router
  ) {}

  ngOnInit(): void {
    this.passwordRecoveryForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get email() {
    return this.passwordRecoveryForm.get('email');
  }

  onSubmit() {
    if (this.passwordRecoveryForm.valid) {
      // Cambiar a "enviado" para mostrar el mensaje
      this.isSubmitted = true;

      // Aquí se realizaría el envío del correo, por ahora se usa un console log
      console.log('Correo enviado!');

      // Redirigir al home después de enviar el correo
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 2000); // Agregar un pequeño retraso para que el mensaje "Te hemos enviado un correo" sea visible
    }
  }
}

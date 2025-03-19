import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  imports: [FormsModule, CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  // Lista de usuarios (simulada)
  usuarios = [
    { id: 1, name: 'Juan Pérez', email: 'juan@ejemplo.com', role: 'Admin' },
    { id: 2, name: 'Ana García', email: 'ana@ejemplo.com', role: 'Usuario' },
  ];

  usuario = { id: 0, name: '', email: '', role: '' }; // Usuario vacío para el formulario

  constructor() { }

  ngOnInit(): void {
  }

  // Simulación de crear o editar un usuario
  onSubmit(): void {
    if (this.usuario.id) {
      // Actualizar usuario (si ya tiene id)
      const index = this.usuarios.findIndex(u => u.id === this.usuario.id);
      if (index !== -1) {
        this.usuarios[index] = { ...this.usuario };
      }
    } else {
      // Crear un nuevo usuario (sin id)
      this.usuario.id = this.usuarios.length + 1; // Asignamos un id incremental
      this.usuarios.push({ ...this.usuario });
    }
    this.resetFormulario();
  }

  // Llenar el formulario con los datos del usuario para editar
  onEditar(usuario: any): void {
    this.usuario = { ...usuario };
  }

  // Eliminar un usuario
  onEliminar(id: number): void {
    this.usuarios = this.usuarios.filter(user => user.id !== id);
  }

  // Limpiar el formulario
  resetFormulario(): void {
    this.usuario = { id: 0, name: '', email: '', role: '' };
  }

}

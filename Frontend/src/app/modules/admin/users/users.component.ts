import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule, CommonModule], // 🔥 Se eliminó AdminComponent
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  searchTerm: string = '';
  selectedCategory: string = '';
  categorias: string[] = ['Admin', 'Vendedor', 'Cliente']; // Ejemplo de categorías

  usuarios = [
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', password: '', role: 'Admin' },
    { id: 2, name: 'Ana Gómez', email: 'ana@example.com', role: 'Cliente' },
    { id: 3, name: 'Carlos López', email: 'carlos@example.com', role: 'Vendedor' },
  ];

  usuario = { id: 0, name: '', email: '', role: '', password: '' }; // 🔥 Se cambió null a 0 para evitar errores

  // Método para filtrar usuarios por nombre y categoría
  get filteredUsers() {
    return this.usuarios.filter((user) => {
      return (
        (!this.selectedCategory || user.role === this.selectedCategory) &&
        (!this.searchTerm || user.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    });
  }

  onSubmit() {
    if (this.usuario.id !== 0) {
      const index = this.usuarios.findIndex((u) => u.id === this.usuario.id);
      if (index !== -1) {
        this.usuarios[index] = { ...this.usuario };
      }
    } else {
      this.usuario.id = this.usuarios.length + 1; // 🔥 Asegurar un ID numérico
      this.usuarios.push({ ...this.usuario });
    }
    this.resetUsuario();
  }

  onEditar(user: any) {
    this.usuario = { ...user };
  }

  onEliminar(id: number) {
    this.usuarios = this.usuarios.filter((u) => u.id !== id);
  }

  resetUsuario() {
    this.usuario = { id: 0, name: '', email: '', role: '', password: '' };
  }
}


import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service'; // Asegúrate de importar el servicio
import { User } from '../../../core/models/user.model'; // Importa el modelo User
import { Role } from '../../../core/models/login.model'; // Asegúrate de tener el modelo de Role
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  searchTerm: string = '';
  selectedCategory: string = '';
  Role: string[] = ['Admin', 'Vendedor', 'Cliente']; // Ejemplo de categorías
  
  usuarios: User[] = [];  // Aseguramos que usuarios sea un array de User
  roles: Role[] = []; // Aquí puedes almacenar los roles si es necesario

  usuario: User = { id: 0, username: '', email: '', roles: [] };  // Asegúrate de que usuario tenga la propiedad roles
  
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // Obtener usuarios desde el backend
    this.getUsuarios();
    // Si necesitas los roles para llenar un selector o algo similar, puedes hacer algo similar
    // this.getRoles(); // Si tienes un servicio para obtener roles también
  }

  // Método para obtener usuarios desde el backend
  getUsuarios(): void {
    this.userService.getUsers().subscribe(
      (data: User[]) => {
        this.usuarios = data;
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
  }

  // Método para filtrar usuarios por nombre y categoría
  get filteredUsers() {
    return this.usuarios.filter((user) => {
      return (
        (!this.selectedCategory || user.roles.some(role => role.name === this.selectedCategory)) &&
        (!this.searchTerm || user.username.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    });
  }

  // Método para manejar el envío del formulario
  onSubmit() {
    if (this.usuario.id !== 0) {
      const index = this.usuarios.findIndex((u) => u.id === this.usuario.id);
      if (index !== -1) {
        this.usuarios[index] = { ...this.usuario };
      }
    } else {
      this.usuario.id = this.usuarios.length + 1; // Asegurar un ID numérico
      this.usuarios.push({ ...this.usuario });
    }
    this.resetUsuario();
  }

  // Método para editar un usuario
  onEditar(user: User) {
    this.usuario = { ...user };
  }

  // Método para eliminar un usuario
  onEliminar(id: number) {
    this.usuarios = this.usuarios.filter((u) => u.id !== id);
  }

  // Resetear el formulario de usuario
  resetUsuario() {
    this.usuario = { id: 0, username: '', email: '', roles: [] };
  }
}

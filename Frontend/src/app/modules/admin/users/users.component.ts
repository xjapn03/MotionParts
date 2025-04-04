import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { Role } from '../../../core/models/login.model';
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
  roleOptions: string[] = ['Admin', 'Vendedor', 'Cliente']; // Etiquetas visibles

  usuarios: User[] = [];
  roles: Role[] = []; // En caso de que los cargues de un servicio

  usuario: User = { id: 0, username: '', email: '', password: '', roles: [] };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUsers();
    this.getRoles();
    // this.getRoles(); // Si luego agregas esta función
  }

  getUsers(): void {
    this.userService.getUsers().subscribe(
      (data: User[]) => {
        this.usuarios = data;
      },
      (error) => {
        console.error('Error al obtener usuarios', error);
      }
    );
  }

  get filteredUsers() {
    return this.usuarios.filter((user) => {
      return (
        (!this.selectedCategory || user.roles?.some(role => role.name === this.selectedCategory)) &&
        (!this.searchTerm || user.username.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    });
  }

  // Crear usuario (POST)
  onCreate(): void {
    const dto = {
      ...this.usuario,
      roleId: this.usuario.roles.map(role => role.id)
    };

    console.log('Creando usuario:', dto); // 🔵 Log al crear

    this.userService.createUser(dto).subscribe(
      (created) => {
        console.log('Usuario creado exitosamente:', created); // 🔵 Log al crear exitosamente
        this.getUsers();
        this.resetUser();
      },
      (error) => {
        console.error('Error al crear usuario', error);
      }
    );
  }

  // Actualizar usuario (PUT)
  onUpdate(): void {
    const dto = {
      ...this.usuario,
      roleId: this.usuario.roles.map(role => role.id)
    };

    console.log('Actualizando usuario:', dto); // 🔵 Log al editar

    if (this.usuario.id) {
      this.userService.updateUser(this.usuario.id, dto).subscribe(
        () => {
          console.log('Usuario actualizado exitosamente'); // 🔵 Log al editar exitosamente
          this.getUsers();
          this.resetUser();
        },
        (error) => {
          console.error('Error al actualizar usuario', error);
        }
      );
    }
  }


  // Eliminar usuario (DELETE)
  onDelete(id: number): void {
    const confirmacion = confirm('¿Está seguro de eliminar a este usuario?');
    if (confirmacion) {
      this.userService.deleteUser(id).subscribe(
        () => {
          console.log(`Usuario con ID ${id} eliminado exitosamente.`); // 🔵 Log de eliminación
          this.getUsers();
        },
        (error) => {
          console.error('Error al eliminar usuario', error);
        }
      );
    }
  }

  // Cargar datos en el formulario (modo edición)
  onEdit(user: User): void {
    this.usuario = { ...user };
  }

  getRoles(): void {
    this.userService.getRoles().subscribe(
      (data: Role[]) => {
        this.roles = data;
      },
      (error) => {
        console.error('Error al obtener roles', error);
      }
    );
  }
  
  compareRoles(role1: Role, role2: Role): boolean {
    return role1 && role2 ? role1.id === role2.id : false;
  }
  
  // Limpiar formulario
  resetUser(): void {
    this.usuario = { id: 0, username: '', email: '', password: '', roles: [] };
  }
}

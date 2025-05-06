import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { Role } from '../../../core/models/login.model';
import { UserInfo } from '../../../core/models/user-info.model';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisterRequest } from '../../../core/models/register-request.model';

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

  usuario: User = {id: 0,username: '',email: '',roles: [],
  userInfo: {userId: 0,type: '',documentType: '',documentNumber: '',documentExp: '',expCountry: '',expRegion: '',expCity: '',firstName: '',middleName: '',lastName: '',secondLastName: '',otherNames: '',legalName: '',email: '',country: '',region: '',city: '',address: '',addressDetail: '',postalCode: '',phone: '',phone2: '',createdAt: '',updatedAt: ''}};

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.getUsers();
    this.getRoles();
    this.loadUserInfo();
    // this.getRoles(); // Si luego agregas esta función
  }

  // Método para cargar la información del usuario autenticado
  loadUserInfo(): void {
    this.authService.getUserInfo().subscribe(
      (userInfo: UserInfo) => {
        this.usuario.userInfo = userInfo || {userId: 0,type: '',documentType: '',documentNumber: '',documentExp: '',expCountry: '',expRegion: '',expCity: '',firstName: '',middleName: '',lastName: '',secondLastName: '',otherNames: '',legalName: '',email: '',country: '',region: '',city: '',address: '',addressDetail: '',postalCode: '',phone: '',phone2: '',createdAt: '',updatedAt: ''};
      },
      (error) => {
        console.error('Error al cargar la información del usuario:', error);
      }
    );
  }

  // Método para actualizar la información del usuario
  onUpdateUserInfo(): void {
    // Asegúrate de que usuario.userInfo tiene los datos correctos
    if (this.usuario.userInfo) {
      this.authService.updateUserInfo(this.usuario.userInfo).subscribe(
        (updatedUserInfo: UserInfo) => {
          console.log('Información actualizada con éxito', updatedUserInfo);
          this.loadUserInfo();  // Recargar la información actualizada
        },
        (error) => {
          console.error('Error al actualizar la información del usuario:', error);
        }
      );
    } else {
      console.error('userInfo no está disponible para actualizar.');
    }
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
    const registerRequest: RegisterRequest = {
      user: {
        id: this.usuario.id,
        username: this.usuario.username,
        email: this.usuario.email,
        password: this.usuario.password,
        roles: this.usuario.roles,
        userInfo: this.usuario.userInfo
      },
      userInfo: this.usuario.userInfo
    };

    console.log('Enviando registerRequest:', registerRequest);

    this.userService.registerUserWithInfo(registerRequest).subscribe(
      (created) => {
        console.log('Usuario registrado exitosamente:', created);
        this.getUsers();
        this.resetUser();
      },
      (error) => {
        console.error('Error al registrar usuario', error);
      }
    );
  }

// Actualizar usuario (PUT)
  onUpdate(): void {
    const dto = {
      ...this.usuario,
      roleId: this.usuario.roles.map(role => role.id),
      userInfo: this.usuario.userInfo
    };

    console.log('Actualizando usuario:', dto); // Log al editar

    if (this.usuario.id) {
      this.userService.updateUser(this.usuario.id, dto).subscribe(
        () => {
          console.log('Usuario actualizado exitosamente'); // Log al editar exitosamente
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
    this.usuario = {id: 0,username: '',email: '',roles: [],
      userInfo: {userId: 0,type: '',documentType: '',documentNumber: '',documentExp: '',expCountry: '',expRegion: '',expCity: '',firstName: '',middleName: '',lastName: '',secondLastName: '',otherNames: '',legalName: '',email: '',country: '',region: '',city: '',address: '',addressDetail: '',postalCode: '',phone: '',phone2: '',createdAt: '',updatedAt: ''}};    
  }

  selectedTab: 'cuenta' | 'info' = 'cuenta';
}

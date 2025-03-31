import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  // Información del usuario
  user = {
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    phone: '123-456-7890',
    bio: 'Desarrollador de software apasionado por la tecnología.',
    profileImage: 'https://via.placeholder.com/150',  // Imagen predeterminada
    password: '1234'  // Contraseña definida del usuario
  };

  // Propiedad para las contraseñas
  passwords = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  // Bandera para mostrar mensaje de contraseña incorrecta
  incorrectPassword: boolean = false;

  // Bandera para el modo de edición
  isEditing: boolean = false;

  // Propiedad para la nueva imagen de perfil
  newProfileImage: string | ArrayBuffer | null = null;

  // Método para alternar entre modo de edición y vista de perfil
  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveChanges() {
    if (this.newProfileImage) {
      this.updateProfileImage();  // Actualiza la imagen si fue modificada
    }
    this.isEditing = false;
    // Aquí podrías enviar los datos actualizados al servidor
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.newProfileImage = e.target?.result ?? null;
        console.log('Imagen cargada:', this.newProfileImage);  // Verifica que la imagen se haya leído correctamente
      };
      reader.readAsDataURL(file); // Convierte el archivo a base64
    }
  }

  // Método para actualizar la imagen de perfil
  updateProfileImage() {
    if (this.newProfileImage) {
      this.user.profileImage = this.newProfileImage as string;
      this.newProfileImage = null;
    }
  }

  // Método para cambiar la contraseña
  onChangePassword() {
    if (this.passwords.currentPassword !== this.user.password) {
      this.incorrectPassword = true;
      return;
    }

    if (this.passwords.newPassword !== this.passwords.confirmPassword) {
      alert('Las contraseñas nuevas no coinciden.');
      return;
    }

    // Actualizar la contraseña del usuario
    this.user.password = this.passwords.newPassword;
    alert('Contraseña cambiada exitosamente.');

    // Limpiar los campos de contraseñas
    this.passwords.currentPassword = '';
    this.passwords.newPassword = '';
    this.passwords.confirmPassword = '';
    this.incorrectPassword = false;
  }
}

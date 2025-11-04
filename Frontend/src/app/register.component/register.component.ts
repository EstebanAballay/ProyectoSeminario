import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsersService } from '../services/users.service';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {
  user = {
    nombre: '',
    apellido: '',
    dni: '',
    celular: '',
    CUIT: '',
    direccion: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(private usersService: UsersService) {}

async  onRegister() {
    if (this.user.password !== this.user.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await this.usersService.register(this.user);
      alert('Usuario registrado con éxito');
    } catch (error) {
      alert('Este usuario ya existe');
    }
  }
  }

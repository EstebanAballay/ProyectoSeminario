import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
    email: '',
    password: '',
    confirmPassword: ''
  };

  onRegister() {
    if (this.user.password !== this.user.confirmPassword) {
      alert('⚠️ Las contraseñas no coinciden');
      return;
    }

    console.log('✅ Usuario registrado:', this.user);
    // Acá podés llamar a tu servicio de backend para guardar el usuario
  }
}

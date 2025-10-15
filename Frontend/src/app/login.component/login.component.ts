import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  
import { Router, RouterModule } from '@angular/router';
import { UsersService } from '../services/users.service';
import * as jwtDecode from 'jwt-decode';

interface TokenData {
  email: string;
  role: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  email: string = '';
  password: string = '';

  constructor(
    private usersService: UsersService,
    private router: Router
  ) {}

  ngOnInit() {
    document.body.classList.add('login');
  }

  ngOnDestroy() {
    document.body.classList.remove('login');
  }

  async onLogin(loginForm: any) {
    if (!loginForm.valid) {
      alert('Por favor, complete todos los campos correctamente.');
      return;
    }

    try {
      const result = await this.usersService.login(this.email.trim(), this.password.trim());

      // Guardar JWT en localStorage
      localStorage.setItem('token', result.token);

      // Decodificar token para obtener el rol
      const decoded: TokenData = (jwtDecode as any).default(result.token);

      // Redirigir según el rol
      switch (decoded.role) {
        case 'admin':
          this.router.navigate(['/admin']);
          break;
        case 'chofer':
          this.router.navigate(['/chofer']);
          break;
        default:
          this.router.navigate(['/menu']); 
      }
    } catch (error: any) {
      alert('Email o contraseña incorrecta');
    }
  }
}
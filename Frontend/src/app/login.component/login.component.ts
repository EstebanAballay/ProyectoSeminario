import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  
import { Router, RouterModule } from '@angular/router';
import { UsersService } from '../services/users.service';


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
  console.log('onLogin llamado');
  if (!loginForm.valid) {
    alert('Por favor, complete todos los campos correctamente.');
    return;
  }

  try {
    const result = await this.usersService.login(this.email.trim(), this.password.trim());
    console.log('result completo:', result);
    console.log('token recibido:', result.token);

    // Guardar JWT en localStorage
    localStorage.setItem('token', result.token);

    // Redirigir directamente al menú para cualquier usuario
    this.router.navigate(['/menu']);

  } catch (error: any) {
    alert('Email o contraseña incorrecta');
  }
}
}
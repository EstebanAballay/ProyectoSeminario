import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  
import { Router, RouterModule } from '@angular/router';
import { UsersService } from '../services/users.service';
import { parseJwt } from '../jwt';

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
    localStorage.removeItem('token');
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
      console.log(
        'Token guardado:',
        localStorage.getItem('token')
      );
      // Decodificar JWT usando la función importada
      const payload = parseJwt(result.token);

      if (!payload || !payload.role) {
        this.router.navigate(['/login']);
        return;
      }

       // Redirigir según el rol
      if (payload.role === 'admin') {
        this.router.navigate(['/admin']); // cambiar despues por el componente de administrador, fue solo de prueba
      } else if (payload.role === 'client') {
        this.router.navigate(['/menu']);
      } else if (payload.role === 'chofer'){
        this.router.navigate(['/menucamionero'])
      } else {
        this.router.navigate(['/paginainicio']);
      }

    } catch (error: any) {
      alert('Email o contraseña incorrecta');
    }
  }
}

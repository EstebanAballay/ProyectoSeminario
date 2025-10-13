import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  
import { Router, RouterModule } from '@angular/router'; // Importar Router y RouterModule

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule], //  agregar RouterModule
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {} //  Inyectar el Router

  ngOnInit() {
    document.body.classList.add('login');
  }

  ngOnDestroy() {
    document.body.classList.remove('login');
  }

  onLogin(loginForm: any) {
    if (loginForm.valid) {
      console.log('Email:', this.email);
      console.log('Password:', this.password);

      // 👉 Redirige a /menu después de login
      this.router.navigate(['/menu']);
    } else {
      alert('Por favor, complete todos los campos correctamente.');
    }
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  email: string = '';
  password: string = '';

  ngOnInit() {
    document.body.classList.add('login');
  }

  ngOnDestroy() {
    document.body.classList.remove('login');
  }

  onLogin() {
    console.log('Email:', this.email);
    console.log('Password:', this.password);
  }
}

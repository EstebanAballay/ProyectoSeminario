import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../services/users.service';

interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  celular: string;
  CUIT: string;
  direccion: string;
  role: string;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuario: Usuario | null = null;

  constructor(private usersService: UsersService) {}

    async ngOnInit() {
    try {
        const user = await this.usersService.getPerfil();
        console.log('usuario desde backend:', user);
        this.usuario = user;
    } catch (e) {
        console.error('No autenticado', e);
    }
    }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuario: Usuario | null = null;
  usuarioEditable: Usuario | null = null;
  modoEdicion = false;
  guardando = false;

  constructor(private usersService: UsersService) {}

    async ngOnInit() {
    try {
        const user = await this.usersService.getPerfil();
        console.log('usuario desde backend:', user);
        this.usuario = user;
        this.usuarioEditable = { ...user };
    } catch (e) {
        console.error('No autenticado', e);
    }
    }

  activarEdicion() {
    if (!this.usuario) return;
    this.usuarioEditable = { ...this.usuario };
    this.modoEdicion = true;
  }

  async guardarCambios() {
    if (!this.usuarioEditable) return;

    this.guardando = true;
    try {
      const payload = {
        nombre: this.usuarioEditable.nombre,
        apellido: this.usuarioEditable.apellido,
        email: this.usuarioEditable.email,
        celular: this.usuarioEditable.celular,
        CUIT: this.usuarioEditable.CUIT,
        direccion: this.usuarioEditable.direccion,
      };

      const actualizado = await this.usersService.actualizarPerfil(payload);
      this.usuario = actualizado;
      this.usuarioEditable = { ...actualizado };
      this.modoEdicion = false;
    } catch (e) {
      console.error('Error al guardar cambios', e);
    } finally {
      this.guardando = false;
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  erroresCampos: Partial<Record<'nombre' | 'apellido' | 'email' | 'celular' | 'CUIT' | 'direccion', string>> = {};

  constructor(private usersService: UsersService, private router: Router) {}

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
    this.erroresCampos = {};
    this.modoEdicion = true;
  }

  limpiarErrorCampo(campo: 'nombre' | 'apellido' | 'email' | 'celular' | 'CUIT' | 'direccion') {
    if (this.erroresCampos[campo]) {
      delete this.erroresCampos[campo];
    }
  }

  private validarCamposRequeridos() {
    this.erroresCampos = {};

    if (!this.usuarioEditable) {
      return false;
    }

    const campos: Array<'nombre' | 'apellido' | 'email' | 'celular' | 'CUIT' | 'direccion'> = [
      'nombre',
      'apellido',
      'email',
      'celular',
      'CUIT',
      'direccion',
    ];

    for (const campo of campos) {
      const valor = this.usuarioEditable[campo];
      if (!valor || !String(valor).trim()) {
        this.erroresCampos[campo] = 'Debe completar todos los campos';
      }
    }

    return Object.keys(this.erroresCampos).length === 0;
  }

  async guardarCambios() {
    if (!this.usuarioEditable) return;

    if (!this.validarCamposRequeridos()) {
      return;
    }

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
      this.erroresCampos = {};
      this.modoEdicion = false;
    } catch (e: any) {
      const mensaje = e?.response?.data?.message;
      const mensajeNormalizado = Array.isArray(mensaje) ? mensaje.join(' ') : String(mensaje ?? '').toLowerCase();

      if (mensajeNormalizado.includes('email ya está registrado') || mensajeNormalizado.includes('email ya esta registrado')) {
        this.erroresCampos.email = 'El email ya está registrado';
      }
      console.error('Error al guardar cambios', e);
    } finally {
      this.guardando = false;
    }
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
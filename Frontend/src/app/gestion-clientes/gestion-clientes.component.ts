import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UsersService } from '../services/users.service';

type EstadoUsuario = 'activo' | 'eliminado';

interface UsuarioGestion {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  role: string;
  estado: EstadoUsuario;
  actualizando?: boolean;
}

@Component({
  selector: 'app-gestion-clientes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './gestion-clientes.component.html',
  styleUrls: ['./gestion-clientes.component.css']
})
export class GestionClientesComponent implements OnInit {
  usuarios: UsuarioGestion[] = [];
  filtro = '';
  cargando = false;
  error = '';
  mensaje = '';

  constructor(private usersService: UsersService) {}

  async ngOnInit() {
    await this.cargarUsuarios();
  }

  async cargarUsuarios() {
    this.cargando = true;
    this.error = '';
    this.mensaje = '';
    try {
      const data = await this.usersService.getListadoGestionClientes();
      this.usuarios = Array.isArray(data)
        ? data.map((usuario: any) => ({
            id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            dni: usuario.dni,
            role: usuario.role,
            estado: usuario.estado === 'eliminado' ? 'eliminado' : 'activo',
          }))
        : [];
    } catch {
      this.error = 'No se pudo cargar la lista de clientes';
      this.usuarios = [];
    } finally {
      this.cargando = false;
    }
  }

  async cambiarEstado(usuario: UsuarioGestion, estado: EstadoUsuario) {
    if (usuario.actualizando || usuario.estado === estado) {
      return;
    }

    this.error = '';
    this.mensaje = '';
    usuario.actualizando = true;

    try {
      const actualizado = await this.usersService.actualizarEstadoUsuario(usuario.id, estado);
      usuario.estado = actualizado.estado === 'eliminado' ? 'eliminado' : 'activo';
      this.mensaje = `Estado actualizado para ${usuario.nombre} ${usuario.apellido}`;
    } catch {
      this.error = `No se pudo actualizar el estado de ${usuario.nombre} ${usuario.apellido}`;
    } finally {
      usuario.actualizando = false;
    }
  }

  get usuariosFiltrados(): UsuarioGestion[] {
    const termino = this.filtro.trim().toLowerCase();

    if (!termino) {
      return this.usuarios;
    }

    return this.usuarios.filter((usuario) => {
      const nombre = (usuario.nombre || '').toLowerCase();
      const apellido = (usuario.apellido || '').toLowerCase();
      const dni = (usuario.dni || '').toLowerCase();

      return (
        nombre.includes(termino) ||
        apellido.includes(termino) ||
        dni.includes(termino)
      );
    });
  }
}

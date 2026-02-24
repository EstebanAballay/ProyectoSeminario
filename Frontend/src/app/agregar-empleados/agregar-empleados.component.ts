import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UsersService } from '../services/users.service';

type RolUsuario = 'admin' | 'client' | 'chofer' | 'mecanico';

interface UsuarioBasico {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  role: RolUsuario;
  roleSeleccionado: RolUsuario;
  guardando?: boolean;
  mostrarPanelChofer?: boolean;
  legajoChofer?: string;
  estadoTransportistaChofer?: string;
}

@Component({
  selector: 'app-agregar-empleados',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './agregar-empleados.component.html',
  styleUrls: ['./agregar-empleados.component.css']
})
export class AgregarEmpleadosComponent implements OnInit {
  usuarios: UsuarioBasico[] = [];
  rolesDisponibles: RolUsuario[] = ['admin', 'client', 'chofer', 'mecanico'];
  filtro = '';
  cargando = false;
  error = '';
  mensaje = '';

  constructor(private usersService: UsersService) {}

  async ngOnInit() {
    this.cargando = true;
    this.error = '';
    this.mensaje = '';
    try {
      const data = await this.usersService.getListadoBasicoUsuarios();
      this.usuarios = Array.isArray(data)
        ? data.map((usuario: any) => {
            const rol = this.rolesDisponibles.includes(usuario.role) ? usuario.role : 'client';
            return {
              id: usuario.id,
              nombre: usuario.nombre,
              apellido: usuario.apellido,
              dni: usuario.dni,
              role: rol,
              roleSeleccionado: rol,
              mostrarPanelChofer: false,
              legajoChofer: '',
              estadoTransportistaChofer: 'EnEspera',
            };
          })
        : [];
    } catch (e) {
      this.error = 'No se pudo cargar la lista de usuarios';
      this.usuarios = [];
    } finally {
      this.cargando = false;
    }
  }

  get usuariosFiltrados(): UsuarioBasico[] {
    const termino = this.filtro.trim().toLowerCase();

    if (!termino) {
      return this.usuarios;
    }

    return this.usuarios.filter((usuario) => {
      const nombre = (usuario.nombre || '').toLowerCase();
      const apellido = (usuario.apellido || '').toLowerCase();
      const dni = (usuario.dni || '').toLowerCase();
      return nombre.includes(termino) || apellido.includes(termino) || dni.includes(termino);
    });
  }

  async guardarRol(usuario: UsuarioBasico) {
    if (usuario.role === usuario.roleSeleccionado || usuario.guardando) {
      return;
    }

    if (usuario.roleSeleccionado === 'chofer' && usuario.role !== 'chofer') {
      usuario.mostrarPanelChofer = true;
      usuario.estadoTransportistaChofer = 'EnEspera';
      return;
    }

    this.error = '';
    this.mensaje = '';
    usuario.guardando = true;

    try {
      const actualizado = await this.usersService.actualizarRolUsuario(usuario.id, usuario.roleSeleccionado);
      usuario.role = actualizado.role;
      usuario.roleSeleccionado = actualizado.role;
      this.mensaje = `Rol actualizado para ${usuario.nombre}`;
    } catch (e) {
      usuario.roleSeleccionado = usuario.role;
      this.error = `No se pudo actualizar el rol de ${usuario.nombre}`;
    } finally {
      usuario.guardando = false;
    }
  }

  cancelarAltaChofer(usuario: UsuarioBasico) {
    usuario.mostrarPanelChofer = false;
    usuario.roleSeleccionado = usuario.role;
    usuario.legajoChofer = '';
    usuario.estadoTransportistaChofer = 'EnEspera';
  }

  async confirmarAltaChofer(usuario: UsuarioBasico) {
    if (usuario.guardando) {
      return;
    }

    const legajo = (usuario.legajoChofer || '').trim();
    if (!legajo) {
      this.error = 'Para crear un chofer debés ingresar legajo';
      return;
    }

    this.error = '';
    this.mensaje = '';
    usuario.guardando = true;

    try {
      await this.usersService.crearTransportistaDesdeUsuario({
        idUsuario: usuario.id,
        legajo,
        estadoTransportista: 'EnEspera',
      });

      const actualizado = await this.usersService.actualizarRolUsuario(usuario.id, 'chofer');
      usuario.role = actualizado.role;
      usuario.roleSeleccionado = actualizado.role;
      usuario.mostrarPanelChofer = false;
      usuario.legajoChofer = '';
      usuario.estadoTransportistaChofer = 'EnEspera';
      this.mensaje = `Chofer creado y rol actualizado para ${usuario.nombre}`;
    } catch (e: any) {
      this.error = e?.response?.data?.message || `No se pudo crear el transportista para ${usuario.nombre}`;
    } finally {
      usuario.guardando = false;
    }
  }
}

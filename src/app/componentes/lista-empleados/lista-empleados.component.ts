import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EmpleadosService, Empleado } from '../../servicios/empleados';

@Component({
  selector: 'app-lista-empleados',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-empleados.component.html',
  styleUrls: ['./lista-empleados.component.css']
})
export class ListaEmpleadosComponent implements OnInit {

  empleadosOriginal: Empleado[] = []; // Guardamos la lista completa acá
  empleados: Empleado[] = [];         // Esta es la que se muestra en la tabla

  constructor(
    private router: Router,
    private empleadosService: EmpleadosService
  ) {}

  ngOnInit(): void {
    this.cargarEmpleados();
  }

  cargarEmpleados() {
    this.empleadosOriginal = this.empleadosService.getEmpleados();
    this.empleados = [...this.empleadosOriginal]; // Empezamos mostrando todos
  }

  filtrarPorRol(event: any) {
    // Pasamos el valor seleccionado a minúsculas para comparar
    const rolSeleccionado = event.target.value.toLowerCase();
    
    if (rolSeleccionado === '') {
      this.empleados = [...this.empleadosOriginal];
    } else {
      this.empleados = this.empleadosOriginal.filter(emp => 
        // Normalizamos el rol del empleado a minúsculas antes de la igualdad
        emp.rol.toLowerCase() === rolSeleccionado
      );
    }
  }

  irAEditar(id: number) {
    this.router.navigate(['/editar-empleado', id]);
  }

  borrar(id: number) {
    if (confirm('¿Seguro que querés dar de baja a este empleado?')) {
      this.empleadosService.borrarEmpleado(id);
      this.cargarEmpleados(); // Recargamos después de borrar
    }
  }
}
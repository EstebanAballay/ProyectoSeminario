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

  empleados: Empleado[] = [];

  constructor(
    private router: Router,
    private empleadosService: EmpleadosService
  ) {}

  ngOnInit(): void {
    this.empleados = this.empleadosService.getEmpleados();
  }

  irAEditar(id: number) {
    this.router.navigate(['/editar-empleado', id]);
  }

  borrar(id: number) {
    if (confirm('¿Seguro que querés dar de baja a este empleado?')) {
      this.empleadosService.borrarEmpleado(id);
      this.empleados = this.empleadosService.getEmpleados();
    }
  }
}

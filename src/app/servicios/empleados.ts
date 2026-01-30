import { Injectable } from '@angular/core';

export interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  rol: string;
  telefono: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  private empleados: Empleado[] = [
    { id: 1, nombre: 'Esteban', apellido: 'Aballay', dni: '12345678', rol: 'Sistemas', telefono: '3511111111' },
    { id: 2, nombre: 'Juan', apellido: 'Pérez', dni: '87654321', rol: 'Logística', telefono: '3512222222' }
  ];

  getEmpleados() {
    return this.empleados;
  }

  getEmpleadoById(id: number) {
    return this.empleados.find(e => e.id === id);
  }

  agregarEmpleado(empleado: Empleado) {
    empleado.id = Date.now();
    this.empleados.push(empleado);
  }

  actualizarEmpleado(id: number, datos: Empleado) {
    const index = this.empleados.findIndex(e => e.id === id);
    if (index !== -1) {
      this.empleados[index] = { ...datos, id };
    }
  }

  borrarEmpleado(id: number) {
    this.empleados = this.empleados.filter(e => e.id !== id);
  }
}

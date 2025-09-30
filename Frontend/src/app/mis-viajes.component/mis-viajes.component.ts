import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mis-viajes',
  standalone: true, // Así podés importarlo directamente en las rutas
  templateUrl: './mis-viajes.component.html',
  styleUrls: ['./mis-viajes.component.css'],
  imports: [CommonModule]
})
export class MisViajesComponent {
  viajes = [
    { origen: 'Córdoba', destino: 'Rosario', fecha: '2025-10-01', numero: 123, estado: 'En viaje', mostrarDetalles: false },
    { origen: 'Mendoza', destino: 'San Luis', fecha: '2025-10-05', numero: 456, estado: 'Pendiente', mostrarDetalles: false }
  ];

  toggleDetalles(viaje: any) {
    viaje.mostrarDetalles = !viaje.mostrarDetalles;
  }
}

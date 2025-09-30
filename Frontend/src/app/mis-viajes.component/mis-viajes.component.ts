import { Component } from '@angular/core';

@Component({
  selector: 'app-mis-viajes',
  templateUrl: './mis-viajes.component.html',
  styleUrls: ['./mis-viajes.component.css']
})
export class MisViajesComponent {
  viajes = [
    {
      origen: 'Villa María',
      destino: 'General Deheza',
      fecha: '28/8/2025',
      estado: 'Pendiente',
      numero: 35389,
      mostrarDetalles: false
    },
    {
      origen: 'Villa María',
      destino: 'General Deheza',
      fecha: '28/8/2025',
      estado: 'En viaje',
      numero: 35389,
      mostrarDetalles: false
    },
    {
      origen: 'Río Cuarto',
      destino: 'Villa María',
      fecha: '28/7/2025',
      estado: 'Pendiente',
      numero: 35388,
      mostrarDetalles: false
    },
    {
      origen: 'Villa María',
      destino: 'General Deheza',
      fecha: '10/6/2025',
      estado: 'Pendiente',
      numero: 35387,
      mostrarDetalles: false
    }
  ];

  toggleDetalles(viaje: any) {
    viaje.mostrarDetalles = !viaje.mostrarDetalles;
  }
}

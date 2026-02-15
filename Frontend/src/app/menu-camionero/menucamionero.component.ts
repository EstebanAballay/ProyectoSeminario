import { Component, OnInit } from '@angular/core';
import { ViajeService } from '../services/viaje.service';
import * as L from 'leaflet'; // Importamos el mapa
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menucamionero',
  imports: [DatePipe, CommonModule],
  templateUrl: './menucamionero.component.html',
  styleUrls: ['./menucamionero.component.css'],
  standalone: true
})
export class MenuCamioneroComponent implements OnInit {

  viajes: any[] = [];
  viajeSeleccionado: any = null;
  map: L.Map | undefined;

  constructor(private viajeService: ViajeService) { }

  ngOnInit(): void {
    this.cargarViajes();
  }

  async cargarViajes() {
    const data = await this.viajeService.getViajesChofer();
    // Filtramos solo los que sean 'Confirmado' (Pago) o 'En viaje'
    // Ajusta los nombres según tu base de datos
    this.viajes = data.filter(v => v.estadoViaje.nombre === 'Confirmado' || v.estadoViaje.nombre === 'En viaje');
  }

  seleccionarViaje(viaje: any) {
    this.viajeSeleccionado = viaje;
    
    // Damos un pequeño tiempo para que el DIV del mapa se renderice en el HTML
    setTimeout(() => {
      this.iniciarMapa(viaje);
    }, 100);
  }

  // --- LÓGICA DE BOTONES ---
  
  async iniciarRecorrido() {
    if(!this.viajeSeleccionado) return;
    
    await this.viajeService.iniciarViaje(this.viajeSeleccionado.ViajeId);
    // Actualizamos el estado localmente para que cambien los botones
    this.viajeSeleccionado.estadoViaje.nombre = 'En viaje';
    alert('¡Buen viaje! Estado actualizado.');
  }

  finalizarRecorrido() {
    this.procesarFinDeViaje('finalizarViaje');
  }

  cancelarRecorrido() {
    if(confirm('¿Seguro que deseas cancelar este viaje?')) {
      this.procesarFinDeViaje('cancelarViaje');
    }
  }

  // Método auxiliar para no repetir código
  async procesarFinDeViaje(metodo: 'finalizarViaje' | 'cancelarViaje') {
    if(!this.viajeSeleccionado) return;

    await this.viajeService[metodo](this.viajeSeleccionado.ViajeId);
    alert('Operación exitosa.');
    // REQUISITO: Eliminar de la lista visual
    this.viajes = this.viajes.filter(v => v.ViajeId !== this.viajeSeleccionado.ViajeId);
    this.viajeSeleccionado = null; // Limpiar selección
  }

  // --- MAPA ---
  iniciarMapa(viaje: any) {
    // Si ya existe mapa, lo borramos para crear uno nuevo
    if (this.map) {
      this.map.remove();
    }

    // Coordenadas (Asegurate que tu backend devuelve lat/lng correctamente)
    const origen = [viaje.CoordXOrigen, viaje.CoordYOrigen] as L.LatLngExpression;
    const destino = [viaje.CoordXDestino, viaje.CoordYDestino] as L.LatLngExpression;

    this.map = L.map('map').setView(origen, 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Marcadores
    L.marker(origen).addTo(this.map!).bindPopup('Origen').openPopup();
    L.marker(destino).addTo(this.map!).bindPopup('Destino');

    // Línea simple entre puntos (Si tienes la polyline de OSRM úsala, sino esto dibuja una linea recta visual)
    L.polyline([origen, destino], { color: 'blue' }).addTo(this.map!);
  }
}
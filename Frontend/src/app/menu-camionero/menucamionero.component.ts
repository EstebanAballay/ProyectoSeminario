import { Component, OnInit } from '@angular/core';
import { ViajeService } from '../services/viaje.service';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as jwt_decode from 'jwt-decode'; // Asegúrate de tener esto instalado

@Component({
  selector: 'app-menucamionero',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './menucamionero.component.html',
  styleUrls: ['./menucamionero.component.css']
})
export class MenuCamioneroComponent implements OnInit {

  // Variables alineadas con tu HTML
  viajes: any[] = [];
  usuario: any = {}; 
  loading: boolean = true;
  viajeParaCancelar: any = null;
  
  // Diccionario para guardar referencias a múltiples mapas
  private maps: { [key: number]: L.Map } = {};

  constructor(private viajeService: ViajeService, private router: Router) { }

  ngOnInit(): void {
    this.fixLeafletIcons();
    this.cargarViajes();
  }


  async cargarViajes() {
    this.loading = true;
    try {
      // 1. Pedimos los datos UNA sola vez
      const data = await this.viajeService.getViajesChofer();
      console.log('--- DATA RECIBIDA ---', data);

      this.viajes = data.filter((v: any) => 
        v.estadoViaje?.nombre === 'Pago confirmado' || 
        v.estadoViaje?.nombre === 'En viaje'
      );
      
      // 3. Inicializamos los mapas (con retardo para que el HTML exista)
      setTimeout(() => {
        this.inicializarMapas(this.viajes);
      }, 200);

    } catch (error) {
      console.error('Error cargando viajes:', error);
    } finally {
      this.loading = false;
    }
  }

  async iniciarViaje(viaje: any) {
    if (!confirm('¿Estás listo para iniciar el viaje?')) return;
    
    try {
      await this.viajeService.iniciarViaje(viaje.ViajeId);
      
      // Actualizamos localmente el estado para que cambien los botones
      viaje.estadoViaje.nombre = 'En viaje';
      alert('¡Buen viaje! Estado actualizado a "En viaje".');
    } catch (error) {
      console.error('Error al iniciar:', error);
      alert('No se pudo iniciar el viaje.');
    }
  }

  async finalizarViaje(viajeId: number) {
    if (!confirm('¿Confirmas que has llegado a destino y finalizado el viaje?')) return;

    try {
      await this.viajeService.finalizarViaje(viajeId);
      
      // Eliminar de la lista visualmente
      this.viajes = this.viajes.filter(v => v.ViajeId !== viajeId);
      alert('Viaje finalizado correctamente.');
    } catch (error) {
      console.error('Error al finalizar:', error);
      alert('Error al finalizar el viaje.');
    }
  }

  async cancelarViaje(viajeId: number) {
    if (!confirm('¿Seguro que deseas CANCELAR este viaje? Desaparecerá de tu lista.')) return;

    try {
      // Llamamos al servicio directo
      await this.viajeService.cancelarViaje(viajeId);
      
      // Eliminar de la lista visualmente
      this.viajes = this.viajes.filter(v => v.ViajeId !== viajeId);
      alert('Viaje cancelado.');
      
    } catch (error) {
      console.error('Error al cancelar:', error);
      alert('Error al cancelar el viaje.');
    }
  }

  // Lógica para MÚLTIPLES mapas (coincide con id="map-{{v.ViajeId}}")
  inicializarMapas(viajes: any[]) {
    viajes.forEach(v => {
      const mapId = `map-${v.ViajeId}`; // El ID dinámico del HTML
      const container = document.getElementById(mapId);

      // Solo creamos el mapa si el div existe y no ha sido creado antes
      if (container && !this.maps[v.ViajeId]) {
        
        // Coordenadas seguras (con valores por defecto si fallan)
        const latOr = parseFloat(v.CoordYOrigen) || -34.6;
        const lngOr = parseFloat(v.CoordXOrigen) || -58.3;
        const latDes = parseFloat(v.CoordYDestino) || -34.7;
        const lngDes = parseFloat(v.CoordXDestino) || -58.4;

        const map = L.map(mapId, {
          center: [latOr, lngOr],
          zoom: 9,
          scrollWheelZoom: false
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

        // Marcadores
        const m1 = L.marker([latOr, lngOr]).addTo(map).bindPopup('Origen');
        const m2 = L.marker([latDes, lngDes]).addTo(map).bindPopup('Destino');

        // Ajustar zoom para ver ambos puntos
        const group = L.featureGroup([m1, m2]);
        map.fitBounds(group.getBounds(), { padding: [50, 50] });

        // Arreglo del mapa gris
        setTimeout(() => { map.invalidateSize(); }, 300);

        this.maps[v.ViajeId] = map;
      }
    });
  }

  private fixLeafletIcons() {
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl, iconUrl, shadowUrl,
      iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;
  }
}
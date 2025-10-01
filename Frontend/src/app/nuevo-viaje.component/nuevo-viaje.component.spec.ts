import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';

@Component({
  selector: 'app-nuevo-viaje',
  templateUrl: './nuevo-viaje.component.html',
  styleUrls: ['./nuevo-viaje.component.css']
})
export class NuevoViajeComponent implements AfterViewInit {
  private map!: L.Map;
  private routingControl: any;

  // Coordenadas y marcadores
  origenCoords: { lat: number, lon: number } | null = null;
  destinoCoords: { lat: number, lon: number } | null = null;
  origenMarker: L.Marker | null = null;
  destinoMarker: L.Marker | null = null;

  // Flag para saber qué marcar
  marcandoDestino: boolean = false;

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map').setView([-34.61, -58.38], 13); // vista inicial (Buenos Aires)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Evento click en el mapa
    this.map.on('click', (e: any) => {
      const lat = e.latlng.lat;
      const lon = e.latlng.lng;

      if (!this.marcandoDestino) {
        this.setOrigen(lat, lon);
      } else {
        this.setDestino(lat, lon);
      }
    });
  }

  setOrigen(lat: number, lon: number): void {
    if (this.origenMarker) {
      this.map.removeLayer(this.origenMarker);
    }

    const origenIcon = L.divIcon({
      className: 'custom-icon',
      html: '🟢',
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    });

    this.origenMarker = L.marker([lat, lon], { icon: origenIcon }).addTo(this.map);
    this.origenCoords = { lat, lon };

    console.log("Origen marcado:", this.origenCoords);
    this.updateRoute();
  }

  setDestino(lat: number, lon: number): void {
    if (this.destinoMarker) {
      this.map.removeLayer(this.destinoMarker);
    }

    const destinoIcon = L.divIcon({
      className: 'custom-icon',
      html: '🔴',
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    });

    this.destinoMarker = L.marker([lat, lon], { icon: destinoIcon }).addTo(this.map);
    this.destinoCoords = { lat, lon };

    console.log("Destino marcado:", this.destinoCoords);
    this.updateRoute();
  }

  updateRoute(): void {
    if (this.origenCoords && this.destinoCoords) {
      // Si ya había una ruta, la borro
      if (this.routingControl) {
        this.map.removeControl(this.routingControl);
      }

      // Creo nueva ruta
      this.routingControl = L.Routing.control({
        waypoints: [
          L.latLng(this.origenCoords.lat, this.origenCoords.lon),
          L.latLng(this.destinoCoords.lat, this.destinoCoords.lon)
        ],
        routeWhileDragging: false
      }).addTo(this.map);
    }
  }
}

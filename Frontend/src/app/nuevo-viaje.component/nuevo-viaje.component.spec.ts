import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
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

  @ViewChild('origenInput') origenInput!: ElementRef<HTMLInputElement>;
  @ViewChild('destinoInput') destinoInput!: ElementRef<HTMLInputElement>;
  @ViewChild('fechaSalidaInput') fechaSalidaInput!: ElementRef<HTMLInputElement>;
  @ViewChild('camionInput') camionInput!: ElementRef<HTMLInputElement>;

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map').setView([-34.6037, -58.3816], 6); // Mapa centrado en Buenos Aires

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);
  }

  async crearViaje(event: Event): Promise<void> {
    event.preventDefault();

    const origen = this.origenInput.nativeElement.value;
    const destino = this.destinoInput.nativeElement.value;
    const fecha = this.fechaSalidaInput.nativeElement.value;
    const camion = this.camionInput.nativeElement.value;

    console.log("🚚 Datos del viaje:", { origen, destino, fecha, camion });

    // Geocodificación de Origen y Destino usando Nominatim (OpenStreetMap)
    const origenCoords = await this.getCoords(origen);
    const destinoCoords = await this.getCoords(destino);

    if (origenCoords && destinoCoords) {
      console.log("Origen coordenadas:", origenCoords);
      console.log("Destino coordenadas:", destinoCoords);

      // Si ya existe una ruta previa, la eliminamos
      if (this.routingControl) {
        this.map.removeControl(this.routingControl);
      }

      // Crear la ruta entre los dos puntos
      this.routingControl = L.Routing.control({
        waypoints: [
          L.latLng(origenCoords.lat, origenCoords.lon),
          L.latLng(destinoCoords.lat, destinoCoords.lon)
        ],
        routeWhileDragging: true, // Esto permite arrastrar el recorrido en el mapa
        lineOptions: {
          styles: [{ color: 'blue', weight: 4, opacity: 0.7 }],
          extendToWaypoints: true, // Asegura que la línea se extienda hasta los puntos de origen y destino
          missingRouteTolerance: 1000 // Si no se puede calcular la ruta, usa este valor de tolerancia
        }
      }).addTo(this.map);

      // Agregar marcadores manualmente para Origen y Destino
      const origenMarker = L.marker([origenCoords.lat, origenCoords.lon]).addTo(this.map)
        .bindPopup('Origen: ' + origen)
        .openPopup();

      const destinoMarker = L.marker([destinoCoords.lat, destinoCoords.lon]).addTo(this.map)
        .bindPopup('Destino: ' + destino)
        .openPopup();

      // Mover el mapa para centrarse en la ruta entre los marcadores
      this.map.fitBounds([
        [origenCoords.lat, origenCoords.lon], // Usando LatLngTuple (array [lat, lon])
        [destinoCoords.lat, destinoCoords.lon]  // Usando LatLngTuple (array [lat, lon])
      ]);
    } else {
      alert("❌ No se pudo encontrar la ubicación. Revisá origen y destino.");
    }
  }

  private async getCoords(place: string): Promise<{ lat: number; lon: number } | null> {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`
    );
    const data = await response.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    }
    return null;
  }
}

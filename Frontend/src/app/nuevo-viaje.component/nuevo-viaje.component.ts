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

  // Coordenadas y marcadores
  origenCoords: { lat: number; lon: number } | null = null;
  destinoCoords: { lat: number; lon: number } | null = null;
  origenMarker: L.Marker | null = null;
  destinoMarker: L.Marker | null = null;

  seleccionandoOrigen: boolean = true;

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map').setView([-34.6037, -58.3816], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    // Escuchar clicks en el mapa
    this.map.on('click', async (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lon = e.latlng.lng;

      // Geocodificación inversa para nombre de lugar
      const placeName = await this.reverseGeocode(lat, lon);

      if (this.seleccionandoOrigen) {
        this.origenCoords = { lat, lon };
        this.origenInput.nativeElement.value = placeName;

        // Reemplazar marcador existente si ya hay uno
        if (this.origenMarker) this.map.removeLayer(this.origenMarker);
        this.origenMarker = L.marker([lat, lon]).addTo(this.map)
          .bindPopup('Origen: ' + placeName)
          .openPopup();

      } else {
        this.destinoCoords = { lat, lon };
        this.destinoInput.nativeElement.value = placeName;

        if (this.destinoMarker) this.map.removeLayer(this.destinoMarker);
        this.destinoMarker = L.marker([lat, lon]).addTo(this.map)
          .bindPopup('Destino: ' + placeName)
          .openPopup();
      }

      // Si hay ambos puntos, dibujar ruta
      if (this.origenCoords && this.destinoCoords) {
        this.dibujarRuta();
      }
    });
  }

  private dibujarRuta(): void {
    if (!this.origenCoords || !this.destinoCoords) return;

    if (this.routingControl) {
      this.map.removeControl(this.routingControl);
    }

    this.routingControl = L.Routing.control({
      waypoints: [
        L.latLng(this.origenCoords.lat, this.origenCoords.lon),
        L.latLng(this.destinoCoords.lat, this.destinoCoords.lon)
      ],
      routeWhileDragging: true,
      lineOptions: {
        styles: [{ color: 'blue', weight: 4, opacity: 0.7 }],
        extendToWaypoints: true,
        missingRouteTolerance: 1000
      }
    }).addTo(this.map);

    this.map.fitBounds([
      [this.origenCoords.lat, this.origenCoords.lon],
      [this.destinoCoords.lat, this.destinoCoords.lon]
    ]);
  }

  async crearViaje(event: Event): Promise<void> {
    event.preventDefault();

    const origen = this.origenInput.nativeElement.value;
    const destino = this.destinoInput.nativeElement.value;
    const fecha = this.fechaSalidaInput.nativeElement.value;
    const camion = this.camionInput.nativeElement.value;

    console.log("🚚 Datos del viaje:", { origen, destino, fecha, camion });

    // Validar que haya seleccionado ambos puntos
    if (!this.origenCoords || !this.destinoCoords) {
      alert("❌ Debés seleccionar origen y destino en el mapa o con el formulario.");
      return;
    }

    // Aquí enviás los datos al backend
  }

  private async getCoords(place: string): Promise<{ lat: number; lon: number } | null> {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`
    );
    const data = await response.json();
    return data.length > 0 ? { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) } : null;
  }

  private async reverseGeocode(lat: number, lon: number): Promise<string> {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
    );
    const data = await response.json();
    return data.display_name || `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet'; // Importamos Leaflet
import { ViajeService } from '../services/viaje.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// Interfaz para tipar tus datos 
interface Viaje {
  ViajeId: number;
  destinoInicio: string;
  destinoFin: string;
  destino: string;
  fechaFin: string;
  fechaInicio: string;
  fechaReserva: string;
  horaSalida:string;
  horaLlegada:string;
  estadoViaje: any;
  duracion: string;
  distancia: string;
  CoordXOrigen: number;
  CoordYOrigen: number;
  CoordXDestino: number;
  CoordYDestino: number;
  unidades: any[];
  choferesDisponibles: string[]; // Lista de nombres
  expandido: boolean; // Para abrir/cerrar el acordeón
  seleccionandoChofer: boolean; // Para mostrar la lista de choferes
  mapa?: L.Map; // Referencia al mapa
}

interface Chofer{
  id: number;
  nombre: string;
  apellido: string;
  legajo: string;
}

// interfaces/unidad.interface.ts
export interface Unidad {
  id: number;
  patente: string;
  marca: string;
  // Agrega esto (opcional) para manejar el formulario
  idChoferSeleccionado?: number; 
}

@Component({
  selector: 'app-consultar-viajes-admin',
  imports: [CommonModule,HttpClientModule,FormsModule],
  standalone: true,
  templateUrl: './consultar-viajes.component.html',
  styleUrl: './consultar-viajes.component.css',
})
export class ConsultarViajes {

  //Servicio para calcular el tiempo de viaje
  private osrmApiUrl = 'https://router.project-osrm.org/route/v1/driving';


  constructor(private viajeService: ViajeService,private http: HttpClient) {};
  // Mock de datos (Simulando lo que traería tu Backend)
  public viajes: Viaje[] = [];

  //atributo para guardar los choferes disponibles
  public choferesDisponibles: Chofer[] = [];


  //Consulto los viajes pendientes al cargar la pagina
  async ngOnInit() {
    this.viajes = await this.viajeService.getViajesPendientes();
    console.log(this.viajes);
  }

  // Acción: Abrir/Cerrar detalle y Cargar Mapa
  toggleDetalle(viaje: Viaje) {
    viaje.expandido = !viaje.expandido;

    if (viaje.expandido) {
      // setTimeout es un truco necesario: esperamos 100ms a que el HTML renderice el div del mapa
      setTimeout(() => {
        this.cargarMapa(viaje);
      }, 100);
    }

    if (!viaje.duracion || viaje.duracion === 'Calculando...') {
      viaje.duracion = 'Calculando...';
      viaje.distancia = 'Calculando...';}
     else {
      // Si cerramos, destruimos el mapa para liberar memoria y limpiar la referencia
        if (viaje.mapa) {
          viaje.mapa.remove(); // Función de Leaflet para destruir la instancia
          viaje.mapa = undefined; // Limpiamos la referencia
        }
      }

    this.obtenerRuta([viaje.CoordXOrigen, viaje.CoordYOrigen], [viaje.CoordXDestino, viaje.CoordYDestino])
        .subscribe({
          next: (res: any) => {
            if (res.routes && res.routes.length > 0) {
              const ruta = res.routes[0];
              
              // OSRM devuelve duración en SEGUNDOS y distancia en METROS
              viaje.duracion = this.formatearDuracion(ruta.duration);
              viaje.distancia = (ruta.distance / 1000).toFixed(1) + ' Km';
              if (viaje.mapa) {
                // OSRM devuelve [Longitud, Latitud], Leaflet necesita [Latitud, Longitud]
                // Hacemos el cambio (map)
                const rutaCoordenadas = ruta.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]);

                // Dibujamos la polilínea con la ruta real
                const lineaRuta = L.polyline(rutaCoordenadas, { 
                  color: 'blue', 
                  weight: 5,       // Un poco más gruesa
                  opacity: 0.7 
                }).addTo(viaje.mapa);

                // Ajustamos el zoom para que se vea toda la ruta perfectamente
                viaje.mapa.fitBounds(lineaRuta.getBounds());
              }
            }
            else {
              // Cerrando: Limpiar mapa
              if (viaje.mapa) {
                viaje.mapa.remove();
                viaje.mapa = undefined;
              }
            }
          },
          error: (err) => {
            console.error('Error calculando ruta', err);
            viaje.duracion = 'No disponible';}
        });
    }
  

  // Lógica del Mapa
  cargarMapa(viaje: Viaje) {
    // Si ya existe mapa, no lo creamos de nuevo
    if (viaje.mapa) return;

    const mapId = `map-${viaje.ViajeId}`;
    const map = L.map(mapId).setView({lat: viaje.CoordXOrigen, lng: viaje.CoordYOrigen}, 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    // Marcadores Inicio y Fin
    L.circleMarker({lat: viaje.CoordXOrigen, lng: viaje.CoordYOrigen}, { color: 'green', radius: 8 }).addTo(map).bindPopup('Inicio');
    L.circleMarker({lat: viaje.CoordXDestino, lng: viaje.CoordYDestino}, { color: 'red', radius: 8 }).addTo(map).bindPopup('Fin');

    viaje.mapa = map;
  }

  // Acción: Mostrar lista de choferes
  async iniciarAsignacion(viaje: Viaje) {
    viaje.seleccionandoChofer = true;
    //cuando el usuario hace click en asignar, traigo los choferes disponibles para ese viaje
    this.choferesDisponibles = await this.viajeService.getChoferesDisponibles(new Date(viaje.fechaInicio), new Date(viaje.fechaFin));
    console.log("Choferes disponibles " + this.choferesDisponibles);
  }

  // Acción: Confirmar viaje con chofer
  confirmarAsignacion(viaje: Viaje, chofer: string) {
    if(confirm(`¿Asignar a ${chofer} para el viaje #${viaje.ViajeId}?`)) {
      // Aquí llamarías a tu servicio Backend para guardar
      alert(`Viaje confirmado con el chofer ${chofer}`);
      this.removerViajeDeLista(viaje);
    }
  }

  // Acción: Rechazar
  rechazarViaje(viaje: Viaje) {
    if(confirm('¿Seguro que deseas rechazar este viaje?')) {
      console.log(viaje.ViajeId)
      this.viajeService.rechazarViaje(viaje.ViajeId);
      this.removerViajeDeLista(viaje);
    }
  }

  private removerViajeDeLista(viaje: Viaje) {
    this.viajes = this.viajes.filter(v => v.ViajeId !== viaje.ViajeId);
  }

  //funcion para calcular la duracion del viaje
  obtenerRuta(inicio: [number, number], fin: [number, number]): Observable<any> {
    // OJO: OSRM espera el orden: Longitud,Latitud (al revés que Leaflet)
    const start = `${inicio[1]},${inicio[0]}`; 
    const end = `${fin[1]},${fin[0]}`;

    // overview=false significa que no nos devuelva toda la geometría de la línea, solo los datos (ahorra datos)
    const url = `${this.osrmApiUrl}/${start};${end}?overview=full&geometries=geojson`;

    return this.http.get(url);
  }


  // Función auxiliar para convertir segundos a texto legible
  private formatearDuracion(segundos: number): string {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    
    if (horas > 0) {
      return `${horas} h ${minutos} min`;
    }
    return `${minutos} min`;
  }



  // Permite al usuario cancelar si se arrepiente
  cancelarAsignacion(viaje: Viaje) {
    viaje.seleccionandoChofer = false;
    // Opcional: limpiar las selecciones hechas si cancela
    viaje.unidades.forEach(u => u.idChoferSeleccionado = undefined);
  }

  // Lógica visual: Evita seleccionar al mismo chofer en 2 unidades distintas del mismo viaje
  choferEstaOcupadoEnOtraUnidad(choferId: number, unidadActualId: number, viaje: Viaje): boolean {
    return viaje.unidades.some(u => 
      u.id !== unidadActualId && u.transportistaIdUsuario === choferId
    );
  }

  // Empaqueta todo y lo manda al servicio
  async guardarCambios(viaje: Viaje) {
    // Filtramos solo las unidades que tienen asignación
    const asignaciones = viaje.unidades
      .filter(u => u.transportistaIdUsuario !== undefined) 
      .map(u => ({
        unidadId: u.UnidadId,
        choferId: u.transportistaIdUsuario
      }));  

    if (asignaciones.length === 0) {
      alert('Debes asignar al menos un chofer para confirmar.');
      return;
    }

    if(confirm(`¿Estás seguro de confirmar ${asignaciones.length} asignaciones para este viaje?`)) {
      try {
        console.log('Enviando al backend:', asignaciones);

        await this.viajeService.asignarChoferes(viaje.ViajeId, asignaciones);
        
        alert('¡Asignaciones guardadas correctamente!');
        this.removerViajeDeLista(viaje); // Sacamos el viaje de la lista de pendientes
      } catch (error) {
        console.error('Error al guardar', error);
        alert('Ocurrió un error al guardar las asignaciones.');
      }
    }
  }
}

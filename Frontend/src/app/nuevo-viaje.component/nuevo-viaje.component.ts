import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UnidadService } from '../services/unidad.service';
import { LoadingService } from '../services/loading.service';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import  {ViajeService} from '../services/viaje.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CobroService } from '../services/cobro.service';

// Solución para el error de los iconos de Leaflet en Angular
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-nuevo-viaje',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [UnidadService,ViajeService],
  templateUrl: './nuevo-viaje.component.html',
  styleUrls: ['./nuevo-viaje.component.css']
})

export class NuevoViajeComponent implements AfterViewInit {
  private map!: L.Map;
  private routingControl: any;
  constructor(private unidadService: UnidadService,
              private viajeService: ViajeService,
              private loadingService: LoadingService,
              private CobroService: CobroService,
              private sanitizer: DomSanitizer) {}

  //atributo para el total del pedido
  public totalGeneral: number = 0;

  //variables para que el usuario pueda seleccionar
  public tiposCamion: string[] = [];
  public tiposAcoplado : string[] = [];
  public tiposSemirremolque : string[] = [];

  //Variable que controla si mostrar la pantalla flotante
  public mostrarResumen = false;
  
  //Variable que guarda las unidades seleccionadas para el resumen
  public unidadesSeleccionadas: any[] = [];

  //Una vez que busca las unidades disponibles las carga aca:
  public camionesDisponibles: any[] = [];
  public acopladosDisponibles: any[] = [];
  public semirremolquesDisponibles: any[] = [];

  //variable para hora de salida
  public horaSalida: string = '';
  
  //variable para la distancia
  public distancia: number = 0;

  //coordenadas de origen y destino
  public origenCoords: { lat: number; lon: number } | null = null;
  public destinoCoords: { lat: number; lon: number } | null = null;


  //datos primordiales del viaje
  public data: any = {
    origen: '',
    destino: '',
    fechaInicio: '',
    fechaFin: '',
    horaInicio:'',
    horaFin:'',
    distancia: 0,
    origenCoords: { lat: 0, lng: 0 },
    destinoCoords: { lat: 0, lng: 0 },
    unidades: []
  };

  //En el init se cargan los datos por unica vez
  async ngOnInit() {
    const camiones = await this.unidadService.consultarCamiones();
    const acoplados = await this.unidadService.consultarAcoplados();
    console.log(camiones);
    // manejar elementos que pueden ser strings o objetos { nombre: string }
    this.tiposCamion = camiones.map(c => typeof c === 'string' ? c : (c as any).nombre || String(c));
    this.tiposSemirremolque = acoplados.map(a => typeof a === 'string' ? a : (a as any).nombre || String(a));

    //esto se hace asi porque si solo se usa el =, se asigna a la misma dir de memoria
    this.tiposAcoplado = [...this.tiposSemirremolque];
    //los tipos de semi son iguales,pero los de acoplado tienen "sin acoplado"
    this.tiposAcoplado.push('Sin acoplado');
    this.tiposSemirremolque.push('Sin semirremolque');
  }

  @ViewChild('origenInput') origenInput!: ElementRef<HTMLInputElement>;
  @ViewChild('destinoInput') destinoInput!: ElementRef<HTMLInputElement>;
  @ViewChild('fechaSalidaInput') fechaSalidaInput!: ElementRef<HTMLInputElement>;

  origenMarker: L.Marker | null = null;
  destinoMarker: L.Marker | null = null;

  // 🚦 Control de flujo
  origenConfirmado: boolean = false; // indica si el usuario confirmó el origen

  mostrarSelector = false;
  tipoCamionSeleccionado: string = '';
  semirremolqueSeleccionado: string = '';
  acopladoSeleccionado: string = '';
  tipoSemirremolqueSeleccionado: string = '';
  quiereSemirremolque: boolean = false;
  quiereAcoplado: boolean = false;
  //camionesSeleccionados son los tipos de camion,semi y acoplado que componen a cada una de las unidades
  camionesSeleccionados: { tipo: string, semirremolque: string, acoplado: string }[] = [];



  ngAfterViewInit(): void {
    this.initMap();
  }

  //Todo esto es del mapa
  private initMap(): void {
    this.map = L.map('map').setView([-34.6037, -58.3816], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    this.map.on('click', async (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lon = e.latlng.lng;
      const placeName = await this.reverseGeocode(lat, lon);

      if (!this.origenCoords) {
        // Seleccionando origen (antes de confirmar)
        this.origenCoords = { lat, lon };
        this.origenInput.nativeElement.value = placeName;

        if (this.origenMarker) this.map.removeLayer(this.origenMarker);
        this.origenMarker = L.marker([lat, lon]).addTo(this.map)
          .bindPopup('Origen: ' + placeName)
          .openPopup();

        alert('Origen seleccionado. Hacé clic en OK para confirmarlo y habilitar el destino.');
        return;
      }

      // Selección de destino solo si origen confirmado
      if (this.origenConfirmado && !this.destinoCoords) {
        this.destinoCoords = { lat, lon };
        this.destinoInput.nativeElement.value = placeName;

        if (this.destinoMarker) this.map.removeLayer(this.destinoMarker);
        this.destinoMarker = L.marker([lat, lon]).addTo(this.map)
          .bindPopup('Destino: ' + placeName)
          .openPopup();

        if (this.origenCoords && this.destinoCoords) {
          this.dibujarRuta();
        }
        return;
      }

      // Si clickeó después de todo
      alert('Origen y destino ya seleccionados.');
    });
  }




  confirmarOrigen(): void {
    if (!this.origenCoords) {
      alert('❌ Primero seleccioná el origen en el mapa o en el formulario.');
      return;
    }
    this.origenConfirmado = true;
    alert('✅ Origen confirmado. Ahora podés seleccionar el destino en el mapa.');
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
      show: false, //evita mostrar el panel con las direccciones
      addWaypoints: false,  // Evita que el usuario añada puntos extra haciendo clic
      containerClassName: 'hidden-router-container',
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
    //Calcular la distancia cuando detecta que se seleccionaron los 2 puntos
    this.routingControl.on('routesfound', (event: any) => {
      const route = event.routes[0]; // primera ruta encontrada
      const distanciaMetros = route.summary.totalDistance;
      const distanciaKm = distanciaMetros / 1000;

      this.distancia = distanciaKm;});

  }
  
  

  async buscarViaje(event: Event): Promise<void> {
    event.preventDefault();

    const origen = this.origenInput.nativeElement.value;
    const destino = this.destinoInput.nativeElement.value;
    const fecha = this.fechaSalidaInput.nativeElement.value;
    const fechaInicio = new Date(fecha);
    //calculo fecha fin sumando 3 dias
    const fechaFin = new Date(fecha);
    fechaFin.setDate(fechaFin.getDate() + 3); // viaje de 3 dias

    console.log("🚚 Datos del viaje:", { 
      origen, 
      destino, 
      fecha, 
      camiones: this.camionesSeleccionados, 
      distancia: this.distancia
    });
    //creo la hora de llegada mockeada
    const horaMockeada = new Date();
    horaMockeada.setHours(17, 0, 0, 0); // 17hs, 0 minutos, 0 segundos, 0 ms

    //rellleno data ahora
    this.data.destinoInicio = origen;
    this.data.destinoFin = destino;
    this.data.fechaInicio = fechaInicio;
    this.data.fechaFin = fechaFin;
    this.data.horaSalida = this.horaSalida;
    this.data.horaLlegada = horaMockeada;
    this.data.distancia = this.distancia;
    this.data.origenCoords = { lat: this.origenCoords!.lat, lng: this.origenCoords!.lon };
    this.data.destinoCoords = { lat: this.destinoCoords!.lat, lng: this.destinoCoords!.lon };

    if (!this.origenCoords || !this.destinoCoords) {
      alert("❌ Debés seleccionar origen y destino en el mapa o con el formulario.");
      return;
    }

    if (this.camionesSeleccionados.length === 0) {
      alert("❌ Debés seleccionar al menos un camión antes de crear el viaje.");
      return;
    }

    //Muestro la pantalla de carga 
    this.loadingService.show();

    //aca busco el viaje
    try {
      const disponibles = await this.viajeService.getUnidadesDisponibles(fechaInicio, fechaFin, this.camionesSeleccionados);
      console.log("✅ Unidades disponibles encontradas:", disponibles);
      this.abrirResumen(disponibles);
    }
    catch (error) {
      console.error("❌ Error al buscar unidades disponibles:", error);
      alert("❌ Ocurrió un error al buscar unidades disponibles. Revisá la consola para más detalles.");
    }
    finally {
      //oculto la pantalla de carga
      this.loadingService.hide();
    }
  }
  
  abrirSelectorVehiculo() { this.mostrarSelector = true; }
  cerrarSelector() { this.mostrarSelector = false; }

  agregarCamion(): void {
    //comprueba si se seleccionaron todos los campos
    if (this.tipoCamionSeleccionado === 'tractoCamion' && this.semirremolqueSeleccionado === '' || this.tipoCamionSeleccionado === '') {
        alert("❌ Debes seleccionar las unidades correctamente.");
        return;
      }
    else  {
        //comprueba que si selecciono un tipo de camion simple,se seleccione el tipo sin semi y sin acoplado
        if (this.tipoCamionSeleccionado !== 'tractoCamion'){
          this.camionesSeleccionados.push({
            tipo: this.tipoCamionSeleccionado,
            semirremolque: 'Sin semirremolque',
            acoplado:  'Sin acoplado',
          })
        }
        else{
        this.camionesSeleccionados.push({
          tipo: this.tipoCamionSeleccionado,
          semirremolque: this.semirremolqueSeleccionado,
          acoplado: this.quiereAcoplado ? this.acopladoSeleccionado : 'Sin acoplado'})
        };

        //reiniciar las variables de seleccion
        this.tipoCamionSeleccionado = '';
        this.semirremolqueSeleccionado = '';
        this.tipoSemirremolqueSeleccionado = '';
        this.quiereSemirremolque = false;
        this.quiereAcoplado = false;
        this.cerrarSelector();
      } 
  }

  toggleSemirremolque(): void {
    this.quiereSemirremolque = !this.quiereSemirremolque;
    if (!this.quiereSemirremolque) {
      this.tipoSemirremolqueSeleccionado = '';
    }
  }

  toggleAcoplado(): void {
    this.quiereAcoplado = !this.quiereAcoplado;
    if (!this.quiereAcoplado) {
      this.tipoSemirremolqueSeleccionado = '';
    }
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


  //esta funcion simplemente habilita que se muestre la pantalla 
  abrirResumen(disponibles: any) {
    this.mostrarResumen = true;
    this.unidadesSeleccionadas = disponibles.unidadesFormadas || [];
    console.log('las unidades disponibles son:',this.unidadesSeleccionadas);
    this.actualizarTotalGeneral();
    console.log('el total es:',this.totalGeneral)
  }

  cerrarResumen() {
    this.mostrarResumen = false;
  }

  confirmarViaje() {
    // Aquí iría tu lógica para enviar la creación al backend
    console.log("Viaje confirmado:");
    console.log(this.data.distancia);
    this.mostrarResumen = false;
    this.data.unidades = this.unidadesSeleccionadas.map((u: any) => {
    return {
      tractoCamionId: u.camion?.id || null,
      semiremolqueId: u.semirremolque?.id || null,
      acopladoId: u.acoplado?.id || null,
      tieneSemirremolque: !!u.semirremolque, // true si existe semirremolque
      tieneAcoplado: !!u.acoplado,           // true si existe acoplado
      subtotal: u.subtotal * this.data.distancia
    };
  });
  this.guardarViaje()
  }

  async guardarViaje() {
    const response = await this.viajeService.crearViaje(this.data);
    console.log(response);
    //reinicio las variables
    this.cobrar(response.ViajeId);
    this.data.unidades = [];
  }

  actualizarTotalGeneral() {
    this.totalGeneral = this.unidadesSeleccionadas.reduce(
      (acum, unidad) => Math.trunc((acum + (unidad.subtotal || 0)*this.data.distancia)*100)/100,
      0
    );
  }

  // Dentro de tu clase de componente
  eliminarCamion(index: number) {
      // El método splice(posicion, cantidad) modifica el array original
      this.camionesSeleccionados.splice(index, 1);
      
      // Opcional: Si necesitas disparar alguna validación extra al borrar
      console.log('Unidad eliminada. Unidades restantes:', this.camionesSeleccionados.length);
  }

  async cobrar(viajeId: number) {
    try {
      // Esperamos la respuesta con 'await'
      const res = await this.CobroService.generarCobro(viajeId);
      
      if (res && res.init_point) {
        window.location.href = res.init_point;
      }
    } catch (err) {
      console.error('Error al generar link', err);
    }
}

}


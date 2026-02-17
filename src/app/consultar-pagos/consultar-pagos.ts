import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViajeService } from '../services/viaje.service';
import { CobroService } from '../services/cobro.service';


export interface ViajePendiente {
  ViajeId: number;
  destinoInicio: string;
  destinoFin: string;
  distancia: number;
  fechaInicio: string; // O Date
  unidades: any[];
  total: number
  resto: number
  sena: number
}

@Component({
  selector: 'app-consultar-pagos',
  imports: [CommonModule],
  templateUrl: './consultar-pagos.html',
  styleUrl: './consultar-pagos.scss',
})

export class ConsultarPagos implements OnInit{

  // La variable que guardará los datos obtenidos del backend
  viajesPendientes: ViajePendiente[] = [];
  loading: boolean = true;

  constructor(private ViajeService: ViajeService,
              private CobroService: CobroService) { }

  ngOnInit(): void {
    this.obtenerPagosPendientes();
  }

  obtenerPagosPendientes() {
    this.loading = true;

    //declara un tiempo de carga
    setTimeout(async () => {
      // Datos mockeados que coinciden con la estructura requerida
      const respuestaBackend: ViajePendiente[] = await this.ViajeService.getViajesPendientesPago(); 
      this.viajesPendientes = respuestaBackend;
      console.log('Datos de viajes pendientes recibidos:', this.viajesPendientes);
      //formateamos los nommbres de y recalculamos la distancia(solo para presentacion)
      this.viajesPendientes.forEach(viaje => {
        viaje.destinoInicio = this.extraerUbicacionCorta(viaje.destinoInicio);
        viaje.destinoFin = this.extraerUbicacionCorta(viaje.destinoFin);
        viaje.unidades.forEach(unidad => {
          unidad.subtotal = unidad.subtotal * viaje.distancia;
        });
      });

      this.loading = false;
    }, 1500); // Simulamos 1.5s de delay de red
  }

  extraerUbicacionCorta(direccion: string): string {
    const partes = direccion.split(',');

    // Verificamos si tiene al menos 3 comas 
    if (partes.length >= 4) {
      // Tomamos los últimos 3 elementos (antepenúltima coma en adelante)
      // .slice(-3) toma los últimos 3, .join(',') los vuelve a unir
      return partes.slice(-3).join(',').trim();
    }
    // Si tiene menos de 3 comas, devolvemos el string original
    return direccion;
  }

  async procesarPago(viaje: ViajePendiente) {
    let tipo = 'resto'
    try{
    const res = await this.CobroService.generarCobro(tipo,viaje.ViajeId);
    //abrimos la ventana de mercado pago
      if (res && res.init_point) {
        window.location.href = res.init_point;
      }
    }
      //verificamos el pago
      catch (err) {
      console.error('Error al generar link', err);}

  }
}

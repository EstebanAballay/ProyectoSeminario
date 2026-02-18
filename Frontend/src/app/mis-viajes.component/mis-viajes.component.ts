import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViajeService } from '../services/viaje.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mis-viajes',
  standalone: true, // Así podés importarlo directamente en las rutas
  templateUrl: './mis-viajes.component.html',
  styleUrls: ['./mis-viajes.component.css'],
  providers: [ViajeService],
  imports: [CommonModule, FormsModule]
})

export class MisViajesComponent {
  constructor(private viajeService: ViajeService) { };
  //atributo de la clase que contiene los viajes
  public viajes: any[] = [];
  public filtroDestino: string = '';
  public filtroFecha: string = '';
  public filtroEstado: string = '';
  public viajesFiltrados = this.viajes;


  //Lo que esta dentro del ngoinit se ejcuta cuando se recarga la pagina
  async ngOnInit() {
    await this.cargarViajes();
  }

  // Centralizamos la carga para refrescar después de cancelar
  async cargarViajes() {
    this.viajes = await this.viajeService.getMisViajes();
    this.viajesFiltrados = this.viajes;
    this.aplicarFiltros();
    console.log(this.viajes);
  }

  // MÉTODO PARA EL BOTÓN CANCELAR
  async cancelarViaje(id: number) {
  if (confirm('¿Estás seguro de que deseas cancelar este viaje?')) {
    try {
      await this.viajeService.cancelarViaje(id);
      
      alert('Viaje cancelado con éxito.');

      // OPCIÓN A: Recargar todo desde el servidor (lo que ya tenés)
      await this.cargarViajes();

      // OPCIÓN B: Eliminarlo visualmente del array para que desaparezca YA
      this.viajes = this.viajes.filter(v => v.ViajeId !== id);
      this.aplicarFiltros(); // Refresca la vista filtrada

    } catch (error) {
      console.error('Error:', error);
      alert('No se pudo cancelar el viaje.');
    }
  }
}

  toggleDetalles(viaje: any) {
    viaje.mostrarDetalles = !viaje.mostrarDetalles;
  }

  aplicarFiltros() {
    this.viajesFiltrados = this.viajes.filter(viaje => {
      const coincideDestino = viaje.destinoFin.toLowerCase().includes(this.filtroDestino.toLowerCase()) ||
        viaje.destinoInicio.toLowerCase().includes(this.filtroDestino.toLowerCase());

      const coincideFecha = this.filtroFecha ? viaje.fechaInicio === this.filtroFecha : true;

      const coincideEstado = this.filtroEstado ? viaje.estadoViaje.nombre === this.filtroEstado : true;

      return coincideDestino && coincideFecha && coincideEstado;
    });
  }
}
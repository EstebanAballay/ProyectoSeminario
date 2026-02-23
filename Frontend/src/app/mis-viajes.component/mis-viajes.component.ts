import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
<<<<<<< HEAD
import { ViajeService } from '../services/viaje.service';
import { FormsModule } from '@angular/forms';
=======
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d

@Component({
  selector: 'app-mis-viajes',
  standalone: true, // Así podés importarlo directamente en las rutas
  templateUrl: './mis-viajes.component.html',
  styleUrls: ['./mis-viajes.component.css'],
<<<<<<< HEAD
  providers: [ViajeService],
  imports: [CommonModule,FormsModule]
})



export class MisViajesComponent {
  constructor(private viajeService: ViajeService) {};
  //atributo de la clase que contiene los viajes
  public viajes: any[] = [];
  public filtroDestino: string = '';
  public filtroFecha: string = '';
  public filtroEstado: string = '';
  public viajesFiltrados = this.viajes;


  //Lo que esta dentro del ngoinit se ejcuta cuando se recarga la pagina
  async ngOnInit() {
    this.viajes = await this.viajeService.getMisViajes();
    this.viajesFiltrados = this.viajes;
    console.log(this.viajes);
  }
=======
  imports: [CommonModule]
})
export class MisViajesComponent {
  viajes = [
    { origen: 'Córdoba', destino: 'Rosario', fecha: '2025-10-01', numero: 123, estado: 'En viaje', mostrarDetalles: false },
    { origen: 'Mendoza', destino: 'San Luis', fecha: '2025-10-05', numero: 456, estado: 'Pendiente', mostrarDetalles: false }
  ];
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d

  toggleDetalles(viaje: any) {
    viaje.mostrarDetalles = !viaje.mostrarDetalles;
  }
<<<<<<< HEAD

  aplicarFiltros() {
    this.viajesFiltrados = this.viajes.filter(viaje => {
      const coincideDestino = viaje.destinoFin.toLowerCase().includes(this.filtroDestino.toLowerCase()) || 
                            viaje.destinoInicio.toLowerCase().includes(this.filtroDestino.toLowerCase());
      
      const coincideFecha = this.filtroFecha ? viaje.fechaInicio === this.filtroFecha : true;
      
      const coincideEstado = this.filtroEstado ? viaje.estadoViaje.nombre === this.filtroEstado : true;

      return coincideDestino && coincideFecha && coincideEstado;
      });
  } 
=======
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
}

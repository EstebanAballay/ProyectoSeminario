import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CobroService } from '../services/cobro.service';

//interfaz para poder hacer el foreach
export interface Pagos{
  id:number,
  viaje:any,
  monto:number,
  fechaCreacion:any,
  transactionId:any,
  tipo:string,
  estadoId:number,
  abonanteId:number
}

@Component({
  selector: 'app-pagos-realizados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagos-realizados.component.html',
  styleUrls: ['./pagos-realizados.component.scss']
})

export class PagosRealizadosComponent implements OnInit {
  constructor(private cobroService: CobroService) { }

  //declaro la variable publica pagos del tipo de la interfaz
  public pagos:Pagos[] = [];

  async ngOnInit(): Promise<void> {
    this.pagos = await this.cobroService.buscarCobrosUsuario();
    console.log(this.pagos);
    this.pagos.forEach( pago=> {
      pago.viaje.destinoInicio = this.extraerUbicacionCorta(pago.viaje.destinoInicio);
      pago.viaje.destinoFin = this.extraerUbicacionCorta(pago.viaje.destinoFin);
      pago.tipo = pago.tipo === 'senia'? 'Seña': "Pago Final";
    })
  }

  async descargarFactura(cobroId:number) {
    const urlDescarga = await this.cobroService.descargarFactura(cobroId);
    // Esto abre la URL en modo descarga sin cambiar al usuario de pantalla
    window.open(urlDescarga, '_blank');
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
}
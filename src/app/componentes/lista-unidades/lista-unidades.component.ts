import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UnidadesService, Unidad } from '../../servicios/unidades';


@Component({
  selector: 'app-lista-unidades',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-unidades.component.html',
  styleUrls: ['./lista-unidades.component.css']
})
export class ListaUnidadesComponent implements OnInit {

  unidades: Unidad[] = [];

  constructor(
    private router: Router,
    private unidadesService: UnidadesService
  ) {}

  ngOnInit(): void {
    this.unidades = this.unidadesService.getUnidades();
  }

  irAEditar(id: number) {
    this.router.navigate(['/editar-unidad', id]);
  }

  borrar(id: number) {
    if (confirm('¿Seguro que querés eliminar esta unidad?')) {
      this.unidadesService.borrarUnidad(id);
      this.unidades = this.unidadesService.getUnidades();
    }
  }
}

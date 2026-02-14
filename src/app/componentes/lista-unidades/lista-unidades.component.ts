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

  unidadesOriginal: Unidad[] = []; // El "backup" de todos los datos
  unidades: Unidad[] = [];         // Lo que se muestra en la tabla

  constructor(
    private router: Router,
    private unidadesService: UnidadesService
  ) {}

  ngOnInit(): void {
    this.cargarUnidades();
  }

  // Centralizamos la carga para que sea más limpio
  cargarUnidades() {
    this.unidadesOriginal = this.unidadesService.getUnidades();
    this.unidades = [...this.unidadesOriginal]; // Iniciamos mostrando todo
  }

  // La lógica del filtro "inmune" a mayúsculas
  filtrarPorTipo(event: any) {
    const tipoSeleccionado = event.target.value.toLowerCase();
    
    if (tipoSeleccionado === '') {
      this.unidades = [...this.unidadesOriginal];
    } else {
      this.unidades = this.unidadesOriginal.filter(unidad => 
        unidad.tipo.toLowerCase() === tipoSeleccionado
      );
    }
  }

  irAEditar(id: number) {
    this.router.navigate(['/editar-unidad', id]);
  }

  borrar(id: number) {
    if (confirm('¿Seguro que querés eliminar esta unidad?')) {
      this.unidadesService.borrarUnidad(id);
      this.cargarUnidades(); // Recargamos la lista actualizada
    }
  }
}
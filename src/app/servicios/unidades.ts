import { Injectable } from '@angular/core';

export interface Unidad {
  id: number;
  tipo: string;
  patente: string;
  marca: string;
  modelo: string;
  estado: string;
}

@Injectable({ providedIn: 'root' })
export class UnidadesService {

  private unidades: Unidad[] = [
    { id: 1, tipo: 'Camión', patente: 'AA123BB', marca: 'Scania', modelo: 'R450', estado: 'Disponible' },
    { id: 2, tipo: 'Remolque', patente: 'CC456DD', marca: 'Helvética', modelo: 'Semirremolque', estado: 'Mantenimiento' }
  ];

  getUnidades() {
    return this.unidades;
  }

  getUnidadById(id: number) {
    return this.unidades.find(u => u.id === id);
  }

  agregarUnidad(unidad: Omit<Unidad, 'id'>) {
    this.unidades.push({ ...unidad, id: Date.now() });
  }

  actualizarUnidad(id: number, datos: Partial<Unidad>) {
    const i = this.unidades.findIndex(u => u.id === id);
    if (i !== -1) this.unidades[i] = { ...this.unidades[i], ...datos };
  }

  borrarUnidad(id: number) {
    this.unidades = this.unidades.filter(u => u.id !== id);
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UnidadService } from '../services/unidad.service';

interface VehiculoAdmin {
    id: number;
    tipo: string;
    subtipo: string;
    patente: string;
    capacidad: number;
    precioKm: number;
    cantidadEjes: number;
    estado: string;
    // campos de edición inline
    editando?: boolean;
    actualizando?: boolean;
    editPatente?: string;
    editCapacidad?: number;
    editPrecioKm?: number;
    editCantidadEjes?: number;
}

@Component({
    selector: 'app-gestion-vehiculos',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './gestion-vehiculos.component.html',
    styleUrls: ['./gestion-vehiculos.component.css']
})
export class GestionVehiculosComponent implements OnInit {
    vehiculos: VehiculoAdmin[] = [];
    filtro = '';
    cargando = false;
    error = '';
    mensaje = '';

    constructor(private unidadService: UnidadService) { }

    async ngOnInit() {
        await this.cargarVehiculos();
    }

    async cargarVehiculos() {
        this.cargando = true;
        this.error = '';
        this.mensaje = '';
        try {
            const data = await this.unidadService.listarVehiculosAdmin();
            this.vehiculos = Array.isArray(data)
                ? data.map((v: any) => ({
                    id: v.id,
                    tipo: v.tipo || '',
                    subtipo: v.subtipo || '',
                    patente: v.patente || '',
                    capacidad: v.capacidad ?? 0,
                    precioKm: v.precioKm ?? 0,
                    cantidadEjes: v.cantidadEjes ?? 0,
                    estado: v.estado || 'disponible',
                }))
                : [];
        } catch {
            this.error = 'No se pudo cargar la lista de vehículos';
            this.vehiculos = [];
        } finally {
            this.cargando = false;
        }
    }

    get vehiculosFiltrados(): VehiculoAdmin[] {
        const termino = this.filtro.trim().toLowerCase();
        if (!termino) {
            return this.vehiculos;
        }
        return this.vehiculos.filter((v) => {
            return (
                v.patente.toLowerCase().includes(termino) ||
                v.tipo.toLowerCase().includes(termino) ||
                v.subtipo.toLowerCase().includes(termino) ||
                v.estado.toLowerCase().includes(termino)
            );
        });
    }

    tipoLabel(tipo: string): string {
        const labels: Record<string, string> = {
            camion: 'Camión',
            acoplado: 'Acoplado',
            semirremolque: 'Semirremolque',
        };
        return labels[tipo] || tipo;
    }

    estadoLabel(estado: string): string {
        const labels: Record<string, string> = {
            disponible: 'Disponible',
            enViaje: 'En viaje',
            dadoDeBaja: 'Dado de baja',
        };
        return labels[estado] || estado;
    }

    estadoBadgeClass(estado: string): string {
        if (estado === 'disponible') return 'badge-disponible';
        if (estado === 'enViaje') return 'badge-enviaje';
        if (estado === 'dadoDeBaja') return 'badge-baja';
        return 'badge-disponible';
    }

    puedeDarDeBaja(vehiculo: VehiculoAdmin): boolean {
        return vehiculo.estado !== 'enViaje' && vehiculo.estado !== 'dadoDeBaja';
    }

    puedeDarDeAlta(vehiculo: VehiculoAdmin): boolean {
        return vehiculo.estado === 'dadoDeBaja';
    }

    async cambiarEstado(vehiculo: VehiculoAdmin, nuevoEstado: string) {
        if (vehiculo.actualizando) return;
        this.error = '';
        this.mensaje = '';
        vehiculo.actualizando = true;
        try {
            const actualizado = await this.unidadService.cambiarEstadoVehiculo(vehiculo.tipo, vehiculo.id, nuevoEstado);
            vehiculo.estado = actualizado.estado || nuevoEstado;
            this.mensaje = `Estado actualizado para ${this.tipoLabel(vehiculo.tipo)} ${vehiculo.patente}`;
        } catch {
            this.error = `No se pudo actualizar el estado de ${vehiculo.patente}`;
        } finally {
            vehiculo.actualizando = false;
        }
    }

    iniciarEdicion(vehiculo: VehiculoAdmin) {
        vehiculo.editando = true;
        vehiculo.editPatente = vehiculo.patente;
        vehiculo.editCapacidad = vehiculo.capacidad;
        vehiculo.editPrecioKm = vehiculo.precioKm;
        vehiculo.editCantidadEjes = vehiculo.cantidadEjes;
    }

    cancelarEdicion(vehiculo: VehiculoAdmin) {
        vehiculo.editando = false;
    }

    async guardarEdicion(vehiculo: VehiculoAdmin) {
        if (vehiculo.actualizando) return;
        this.error = '';
        this.mensaje = '';
        vehiculo.actualizando = true;
        try {
            const data: any = {
                patente: vehiculo.editPatente,
                capacidad: vehiculo.editCapacidad,
                precioKm: vehiculo.editPrecioKm,
                cantidadEjes: vehiculo.editCantidadEjes,
            };
            const actualizado = await this.unidadService.modificarVehiculo(vehiculo.tipo, vehiculo.id, data);
            vehiculo.patente = actualizado.patente ?? vehiculo.editPatente!;
            vehiculo.capacidad = actualizado.capacidad ?? vehiculo.editCapacidad!;
            vehiculo.precioKm = actualizado.precioKm ?? vehiculo.editPrecioKm!;
            vehiculo.cantidadEjes = actualizado.cantidadEjes ?? vehiculo.editCantidadEjes!;
            vehiculo.editando = false;
            this.mensaje = `Datos actualizados para ${this.tipoLabel(vehiculo.tipo)} ${vehiculo.patente}`;
        } catch {
            this.error = `No se pudo guardar los cambios de ${vehiculo.patente}`;
        } finally {
            vehiculo.actualizando = false;
        }
    }
}

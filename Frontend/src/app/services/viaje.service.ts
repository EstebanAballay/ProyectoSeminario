import { Injectable } from '@angular/core';
import axios from '../../api/axiosClient';
import { config } from '../config/env';

@Injectable({ providedIn: 'root' })
export class ViajeService {

    private apiUrl = `${config.services.viajes}/viaje`;

    // ================================
    // OBTENER UNIDADES DISPONIBLES
    // ================================
    async getUnidadesDisponibles(
        fechaInicio: Date,
        fechaFin: Date,
        camiones: any
    ): Promise<any> {

        const inicio = fechaInicio.toISOString();
        const fin = fechaFin.toISOString();

        const url = `${this.apiUrl}/viajesRango?fechaInicio=${inicio}&fechaFin=${fin}`;

        try {
        const response = await axios.post(url, camiones);
        return response.data;
        } catch (error) {
        console.error('Error al obtener unidades disponibles:', error);
        throw error;
        }
    }

    // ================================
    // CANCELAR VIAJE
    // ================================
    async cancelarViaje(id: number): Promise<any> {
        const url = `${this.apiUrl}/cancelar/${id}`;

        try {
        const response = await axios.patch(url);
        return response.data;
        } catch (error) {
        console.error('Error al cancelar el viaje:', error);
        throw error;
        }
    }

    // ================================
    // CREAR VIAJE
    // ================================
    async crearViaje(data: any): Promise<any> {
        const url = `${this.apiUrl}/nuevoViaje`;

        try {
        const response = await axios.post(url, data);
        return response.data;
        } catch (error) {
        console.error('Error al crear el viaje:', error);
        throw error;
        }
    }

    // ================================
    // MIS VIAJES
    // ================================
    async getMisViajes(): Promise<any> {
        const url = `${this.apiUrl}/misViajes`;

        try {
        const response = await axios.get(url);
        return response.data;
        } catch (error) {
        console.error('Error al obtener mis viajes:', error);
        throw error;
        }
    }

    // ================================
    // VIAJES PENDIENTES (ADMIN)
    // ================================
    async getViajesPendientes(): Promise<any> {
        const url = `${this.apiUrl}/viajesPendientes`;

        try {
        const response = await axios.get(url);
        return response.data;
        } catch (error) {
        console.error('Error al obtener viajes pendientes:', error);
        throw error;
        }
    }

    // ================================
    // CHOFERES DISPONIBLES
    // ================================
    async getChoferesDisponibles(
        fechaInicio: Date,
        fechaFin: Date
    ): Promise<any> {

        const url = `${this.apiUrl}/choferesDisponibles`;

        try {
        const response = await axios.get(url, {
            params: {
            desde: fechaInicio.toISOString(),
            hasta: fechaFin.toISOString(),
            },
        });

        return response.data;
        } catch (error) {
        console.error('Error al obtener choferes disponibles:', error);
        throw error;
        }
    }

    // ================================
    // ASIGNAR CHOFERES
    // ================================
    async asignarChoferes(
        viajeId: number,
        asignaciones: any[]
    ): Promise<any> {

        const url = `${this.apiUrl}/asignarChoferes`;

        try {
        const response = await axios.post(url, {
            viajeId,
            asignaciones,
        });

        return response.data;
        } catch (error) {
        console.error('Error al asignar choferes:', error);
        throw error;
        }
    }

    // ================================
    // RECHAZAR VIAJE
    // ================================
    async rechazarViaje(viajeId: number): Promise<any> {
        const url = `${this.apiUrl}/rechazarViaje/${viajeId}`;

        try {
        const response = await axios.patch(url);
        return response.data;
        } catch (error) {
        console.error('Error al rechazar el viaje:', error);
        throw error;
        }
    }

    // ================================
    // VIAJES PENDIENTES DE PAGO
    // ================================
    async getViajesPendientesPago(): Promise<any> {
        const url = `${this.apiUrl}/viajesPorPagar`;

        try {
        const response = await axios.get(url);
        return response.data;
        } catch (error) {
        console.error('Error al obtener viajes pendientes de pago:', error);
        throw error;
        }
    }
}

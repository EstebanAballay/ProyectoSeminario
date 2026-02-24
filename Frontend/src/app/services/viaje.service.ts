import { Injectable } from '@angular/core';
import axios from '../../api/axiosClient';
import { config } from '../config/env';

@Injectable({ providedIn: 'root' })
export class ViajeService {

    private apiUrl = `${config.services.viajes}/viaje`;

    // ===============================
    //  UNIDADES DISPONIBLES
    // ===============================
    async getUnidadesDisponibles(fechaInicio: Date, camiones:any, origenCoords:any, destinoCoords:any): Promise<any> {
        const dto = {camiones:camiones, origenCoords:origenCoords, destinoCoords:destinoCoords}

        console.log(camiones);
        // Convertimos las fechas al formato ISO (o el que espere tu back)
        const inicio = fechaInicio.toISOString();

        const url = `${this.apiUrl}/viajesRango?fechaInicio=${inicio}`;

        try {
            const response = await axios.post(url,{camiones,dto});
            return response.data;
        } catch (error) {
            console.error('Error al obtener unidades disponibles:', error);
            throw error;
        }
    }

    // ===============================
    // CREAR VIAJE
    // ===============================
    async crearViaje(data: any): Promise<any> {
        const url = `${this.apiUrl}/nuevoViaje`;

        try {
        const response = await axios.post(url, data);
        return response.data;
        } catch (error) {
        console.error('Error al crear viaje:', error);
        throw error;
        }
    }

    // ===============================
    // MIS VIAJES
    // ===============================
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

    // ===============================
    // VIAJES PENDIENTES (ADMIN)
    // ===============================
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

    // ===============================
    // CHOFERES DISPONIBLES
    // ===============================
    async getChoferesDisponibles(fechaInicio: Date,fechaFin: Date): Promise<any> {
        const url = `${this.apiUrl}/choferesDisponibles`;
        try {
            const response = await axios.get(url, {params: {desde: fechaInicio.toISOString(), hasta: fechaFin.toISOString()}});
            console.log('los users en el front son:',typeof(response.data))
            return response.data; 
        }catch (error) {
            console.error('Error al obtener choferes disponibles:', error);
            throw error;
        }
    }

    // ===============================
    // ASIGNAR CHOFERES
    // ===============================
    async asignarChoferes(
        viajeId: number,
        asignaciones: any[]
    ): Promise<any> {

        const url = `${this.apiUrl}/asignarChoferes`;

        try {
        const response = await axios.post(url, {
            viajeId,
            asignaciones
        });

        return response.data;

        } catch (error) {
        console.error('Error al asignar choferes:', error);
        throw error;
        }
    }

    // ===============================
    // RECHAZAR VIAJE
    // ===============================
    async rechazarViaje(viajeId: number): Promise<any> {

        const url = `${this.apiUrl}/rechazarViaje/${viajeId}`;

        try {
        const response = await axios.patch(url);
        return response.data;
        } catch (error) {
        console.error('Error al rechazar viaje:', error);
        throw error;
        }
    }

    // ===============================
    // VIAJES PENDIENTES DE PAGO
    // ===============================
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
// ===============================
// CANCELAR VIAJE
// ===============================
async cancelarViaje(viajeId: number): Promise<any> {

    const url = `${this.apiUrl}/${viajeId}/cancelar`;

    try {
        const response = await axios.patch(url);
        return response.data;
    } catch (error) {
        console.error('Error al cancelar viaje:', error);
        throw error;
    }
}}
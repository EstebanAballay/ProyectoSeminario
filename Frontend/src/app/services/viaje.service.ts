import { Injectable } from '@angular/core';
import axios from '../../api/axiosClient';

@Injectable({ providedIn: 'root' })
export class ViajeService {
    
    private apiUrl = 'http://localhost:3004/viaje';

    // === MÉTODO CORREGIDO: CANCELAR VIAJE ===
    async cancelarViaje(id: number): Promise<any> {
        const url = `${this.apiUrl}/cancelar/${id}`;
        try {
            // Usamos PATCH porque en el backend definiste @Patch('cancelar/:id')
            const response = await axios.patch(url);
            return response.data;
        } catch (error) {
            console.error('Error al cancelar el viaje en el servicio:', error);
            throw error;
        }
    }

    async getUnidadesDisponibles(fechaInicio: Date, fechaFin: Date, camiones: any): Promise<any> {
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

    async getChoferesDisponibles(fechaInicio: Date, fechaFin: Date): Promise<any> {
        const url = `${this.apiUrl}/choferesDisponibles`;
        try {
            const response = await axios.get(url, { 
                params: { desde: fechaInicio.toISOString(), hasta: fechaFin.toISOString() } 
            });
            return response.data;
        } catch (error) {
            console.error('Error al obtener choferes disponibles:', error);
            throw error;
        }
    }

    async asignarChoferes(viajeId: number, asignaciones: any[]): Promise<any> {
        const url = `${this.apiUrl}/asignarChoferes`;
        try {
            const response = await axios.post(url, { viajeId, asignaciones });
            return response.data;
        } catch (error) {
            console.error('Error al asignar choferes:', error);
            throw error;
        }
    }

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
}
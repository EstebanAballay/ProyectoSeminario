import { Injectable } from '@angular/core';
import axios from '../../api/axiosClient';
import { config } from '../config/env';

@Injectable({ providedIn: 'root' })

export class ViajeService {
    private apiUrl = `${config.services.viajes}/viaje`;

   
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

    async crearViaje(data:any): Promise<any> {
        const url = `${this.apiUrl}/nuevoViaje`;
        console.log("Token en storage:", localStorage.getItem('token'));
        try {
            const response = await axios.post(url, data);
            console.log(response.data);
            return response.data;
            
        }
        catch (error) {
            console.error('Error al crear la unidad:', error);
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
        }}

    async getChoferesDisponibles(fechaInicio: Date, fechaFin: Date): Promise<any> {
        const url = `${this.apiUrl}/choferesDisponibles`;
        try {
            const response = await axios.get(url, { params: { desde: fechaInicio.toISOString(), hasta: fechaFin.toISOString() } });
            return response.data;
            console.log(response.data);
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

    async rechazarViaje(viajeId:number):Promise<any>{
        try{
            const response = await axios.patch(`${this.apiUrl}/rechazarViaje/${viajeId}`);
            return response.data;
        }
        catch(error){
            console.error('Error al rechazar el viaje:', error);
            throw error;
        }
    }

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
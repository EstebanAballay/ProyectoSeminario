import { Injectable } from '@angular/core';
import axios from '../../api/axiosClient';

@Injectable({ providedIn: 'root' })

export class ViajeService {
    private apiUrl = 'http://localhost:3004/viaje';
    
    async getUnidadesDisponibles(fechaInicio: Date, fechaFin: Date, camiones:any ): Promise<any> {
        console.log(camiones);
        // Convertimos las fechas al formato ISO (o el que espere tu back)
        const inicio = fechaInicio.toISOString();
        const fin = fechaFin.toISOString();

        const url = `${this.apiUrl}/viajesRango?fechaInicio=${inicio}&fechaFin=${fin}`;

        try {
        const response = await axios.post(url,camiones);
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
            return response.data;
        }
        catch (error) {
            console.error('Error al crear la unidad:', error);
            throw error;
        }
  }

}
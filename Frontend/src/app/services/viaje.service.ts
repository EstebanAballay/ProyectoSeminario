import { Injectable } from '@angular/core';
<<<<<<< HEAD
import { Observable } from 'rxjs';
import axios from '../../api/axiosClient';
import { config } from '../config/env';
=======
import axios from 'axios';
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d

@Injectable({ providedIn: 'root' })

export class ViajeService {
<<<<<<< HEAD
    private apiUrl = `${config.services.viajes}/viaje`;
    
=======
    private apiUrl = 'http://localhost:3004/viaje';

>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
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
<<<<<<< HEAD
        console.log("Token en storage:", localStorage.getItem('token'));
        try {
            const response = await axios.post(url, data);
            console.log(response.data);
            return response.data;
            
=======

        try {
            const response = await axios.post(url, data);
            return response.data;
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
        }
        catch (error) {
            console.error('Error al crear la unidad:', error);
            throw error;
        }
  }

<<<<<<< HEAD

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

    // Traer viajes asignados al chofer (Backend debe filtrar los que no estén finalizados)
  async getViajesChofer(): Promise<any[]> {
    const response = await axios.get<any[]>(`${this.apiUrl}/chofer`);
    return response.data;
  }

  // Métodos para cambiar estado
  async iniciarViaje(viajeId: number): Promise<any> {
    const response = await axios.patch(`${this.apiUrl}/iniciar/${viajeId}`, {},);
    return response.data;
  }

  async finalizarViaje(viajeId: number): Promise<any> {
    const response = await axios.patch(`${this.apiUrl}/finalizar/${viajeId}`, {});
    return response.data;
  }

  async cancelarViaje(viajeId: number): Promise<any> {
    const response = await axios.patch(`${this.apiUrl}/cancelar/${viajeId}`,);
    return response.data;
  }
=======
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
}
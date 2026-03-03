import { Injectable } from '@angular/core';
import axios from '../../api/axiosClient';
import { config } from '../config/env';

@Injectable({ providedIn: 'root' })

export class UnidadService {
    private apiUrl = `${config.services.unidad}/unidad`;

    async postViaje(endpoint: string): Promise<any> {
        try {
            const response = await axios.post(`${this.apiUrl}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    }

    async consultarAcoplados(): Promise<string[]> {
        try {
            const response = await axios.get<string[]>(`${this.apiUrl}/tiposAcoplados`);
            return response.data;
        } catch (error) {
            console.error('Error fetching tiposAcoplados:', error);
            throw error;
        }
    }

    async consultarCamiones(): Promise<string[]> {
        console.log("llego hasta aca")
        try {
            const response = await axios.get<string[]>(`${this.apiUrl}/tiposCamiones`);
            return response.data;
        } catch (error) {
            console.error('Error fetching tiposCamiones:', error);
            throw error;
        }
    }

    async crearUnidad(data: any): Promise<any> {
        const url = `${this.apiUrl}/nuevaUnidad`;
        try {
            const response = await axios.post(url, data);
            return response.data;
        }
        catch (error) {
            console.error('Error al crear la unidad:', error);
            throw error;
        }
    }

    async listarVehiculosAdmin(): Promise<any[]> {
        try {
            const response = await axios.get<any[]>(`${this.apiUrl}/admin/vehiculos`);
            return response.data;
        } catch (error) {
            console.error('Error fetching vehiculos admin:', error);
            throw error;
        }
    }

    async cambiarEstadoVehiculo(tipo: string, id: number, estado: string): Promise<any> {
        try {
            const response = await axios.patch(`${this.apiUrl}/admin/vehiculos/${tipo}/${id}/estado`, { estado });
            return response.data;
        } catch (error) {
            console.error('Error cambiando estado vehiculo:', error);
            throw error;
        }
    }

    async modificarVehiculo(tipo: string, id: number, data: any): Promise<any> {
        try {
            const response = await axios.patch(`${this.apiUrl}/admin/vehiculos/${tipo}/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error modificando vehiculo:', error);
            throw error;
        }
    }
}
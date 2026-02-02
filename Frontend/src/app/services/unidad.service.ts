import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({ providedIn: 'root' })

export class UnidadService {
    private apiUrl = 'http://localhost:3002/unidad';

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
        try {
            const response = await axios.get<string[]>(`${this.apiUrl}/tiposCamiones`);
            return response.data;
        } catch (error) {
            console.error('Error fetching tiposCamiones:', error);
            throw error;
        }
    }

    async crearUnidad(data:any): Promise<any> {
        const url = `${this.apiUrl}/nuevaUnidad`;
        try {
            const response = await axios.post(url, data);
            return response.data;}    
        catch (error) {
            console.error('Error al crear la unidad:', error);
            throw error;
        }
    }
}
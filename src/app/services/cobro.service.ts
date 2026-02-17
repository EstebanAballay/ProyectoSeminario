import { Injectable } from '@angular/core';
import axios from '../../api/axiosClient';
import { config } from '../config/env';

@Injectable({ providedIn: 'root' })

export class CobroService {
    private apiUrl = `${config.services.cobros}/cobros`;
    
    //Esta funcion actua como el gestor del cobro de la senia
    async generarCobro(tipo: string, ViajeId:number): Promise<any> {
        const dto:any = {viajeId:ViajeId,tipo:tipo}
        console.log(dto)
        try {
            //ordena crear el cobro
            const response = await axios.post(`${this.apiUrl}`,dto);
            const data = response.data;
            console.log(data);
            //si se crea el cobro, general el link para ir a pagar a mercado pago
            if (data && data.id) {
                try { 
                    const pagoResponse = await axios.post(`${this.apiUrl}/${data.id}/pagar`);
                    return pagoResponse.data;}
                catch (error) {
                    console.error('Error al generar el link de pago:', error);
                    throw error;
                }}
        } 
        catch (error) {
            console.error('Error al crear el cobro', error);
            throw error;
        }

    }
}
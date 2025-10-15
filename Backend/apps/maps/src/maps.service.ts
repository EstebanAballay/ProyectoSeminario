import { Injectable } from '@nestjs/common';
import { Client } from '@googlemaps/google-maps-services-js';

@Injectable()
export class MapsService {
  private client = new Client({});

  async calcularRuta(origen: { lat: number; lng: number }, destino: { lat: number; lng: number }, horaSalida: Date) {
    const response = await this.client.distancematrix({
      params: {
        origins: [`${origen.lat},${origen.lng}`],
        destinations: [`${destino.lat},${destino.lng}`],
        departure_time: Math.floor(horaSalida.getTime() / 1000), // en segundos UNIX
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    const element = response.data.rows[0].elements[0];
    if (element.status !== 'OK') {
      throw new Error('No se pudo calcular la ruta');
    }

    const duracionSegundos = element.duration.value; // duración estimada
    const llegada = new Date(horaSalida.getTime() + duracionSegundos * 1000);

    return {
      distancia: element.distance.text,
      duracion: element.duration.text,
      horaLlegada: llegada.toISOString(),
    };
  }
}

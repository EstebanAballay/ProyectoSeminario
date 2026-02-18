import { BadRequestException, Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'; // Importamos Payment

@Injectable()
export class MercadoPagoService {
  private client: MercadoPagoConfig;

  constructor() {
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error('MP_ACCESS_TOKEN environment variable is not defined');
    }

    this.client = new MercadoPagoConfig({ accessToken });
  }

  /**
   * Obtiene los detalles de un pago realizado para confirmar su estado
   * y recuperar el cobroId (external_reference).
   */
  async getPaymentDetails(paymentId: string) {
    try {
      const payment = new Payment(this.client);
      const result = await payment.get({ id: paymentId });

      return {
        cobroId: result.external_reference, // Este es el ID que guardamos al crear la preferencia
        status: result.status,             // Ej: 'approved'
        statusDetail: result.status_detail, // Ej: 'accredited'
        payer: {
          email: result.payer.email,
          nombre: result.payer.first_name,
          apellido: result.payer.last_name,
          dni: result.payer.identification?.number, // El DNI suele estar aquí
          tipoDoc: result.payer.identification?.type, // Ej: "DNI"
          telefono: result.payer.phone?.number // A veces viene, a veces no   
           }
      } 
    }
    catch (error) {
      throw new Error(`Error al obtener detalles del pago ${paymentId}: ${error.message}`);
    }
  } 
 
  /** 
   * Genera el link de pago incluyendo la URL de notificación de Ngrok.
   */
  async createPreference(cobroId: number, monto: number, notificationUrl: string) {
    const preference = new Preference(this.client);
    console.log("he logrado entrar a la funcion para crear el link de mercadopago")
    const result = await preference.create({
      body: {
        items: [
          {
            id: cobroId.toString(),
            title: `Cobro de Servicio ${cobroId}`,
            quantity: 1,
            unit_price: Number(monto),
            currency_id: 'ARS',
          },
        ],
        // Guardamos el ID del registro en Supabase aquí
        external_reference: cobroId.toString(),

        // URL del túnel Ngrok para recibir el Webhook
        notification_url: notificationUrl,

        back_urls: {
          success: 'https://localhost:4200/menu',
          failure: 'https://localhost:4200/nuevoviaje'
        },
        auto_return: 'approved'
      },
    });
    return result;
  } 
} 
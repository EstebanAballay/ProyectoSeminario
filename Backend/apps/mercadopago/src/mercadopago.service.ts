import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Preference } from 'mercadopago';

@Injectable()
export class MercadoPagoService {
  private preference: Preference;

  constructor() {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN,
    });
    this.preference = new Preference(client);
  }

async createPreference(data: { cobroId: number; monto: number }) {
  const preference = {
    items: [
      {
        id: data.cobroId.toString(),
        title: `Cobro ${data.cobroId}`,
        quantity: 1,
        currency_id: 'ARS',
        unit_price: data.monto,
      },
    ],
    back_urls: {
      success: 'https://example.com/success',
      failure: 'https://example.com/failure',
      pending: 'https://example.com/pending',
    }
  };

  return await this.preference.create({ body: preference });
}

}


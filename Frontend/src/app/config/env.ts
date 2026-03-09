export const config = {
  //todos apuntan al mismo lugar porque usamos un api-gateway
  services: {
    user: 'https://api-gateway-681050609269.us-central1.run.app/api',
    cobros: 'https://api-gateway-681050609269.us-central1.run.app/api',
    unidad: 'https://api-gateway-681050609269.us-central1.run.app/api',
    viajes: 'https://api-gateway-681050609269.us-central1.run.app/api',
    mercadopago: 'https://api-gateway-681050609269.us-central1.run.app/api'
  },
  endpoints: {
    auth: {
      login: 'user/login',
      register: 'user/register',
    },
  },
}
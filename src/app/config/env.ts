export const config = {
  services:{
    user: 'http://localhost:3003',
    cobros: 'http://localhost:3001',
    unidad: 'http://localhost:3002',
    viajes: 'http://localhost:3004',
    mercadopago: 'http://localhost:3005'
  },
  endpoints: {
    auth: {
      login: 'user/login',
      register: 'user/register',
    },
  },
}
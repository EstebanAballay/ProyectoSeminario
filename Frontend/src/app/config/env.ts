export const config = {
  services:{
    user: 'http://localhost:3007',
    cobros: 'http://localhost:3001',
    unidad: 'http://localhost:3002',
    viajes: 'http://localhost:3004',
    mercadopago: 'http://localhost:3005'
  },
  endpoints: {
    auth: {
      login: 'auth/login',
      register: 'users/register',
    },
  },
}
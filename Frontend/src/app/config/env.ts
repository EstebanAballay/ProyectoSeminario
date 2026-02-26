export const config = {
  //todos apuntan al mismo lugar porque usamos un api-gateway
  services:{
    user: 'http://localhost:3000/api',
    cobros: 'http://localhost:3000/api',
    unidad: 'http://localhost:3000/api',
    viajes: 'http://localhost:3000/api',
    mercadopago: 'http://localhost:3000/api'
  },
  endpoints: {
    auth: {
      login: 'user/login',
      register: 'user/register',
    },
  },
}
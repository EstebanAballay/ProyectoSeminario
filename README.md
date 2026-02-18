# 🚛 Grafo Logística

![NestJS](https://img.shields.io/badge/Backend-NestJS-red) ![Angular](https://img.shields.io/badge/Frontend-Angular-dd0031) ![PostgreSQL](https://img.shields.io/badge/DB-PostgreSQL-blue) ![Docker](https://img.shields.io/badge/DevOps-Docker-2496ed) ![Mercado Pago](https://img.shields.io/badge/Integration-Mercado%20Pago-009ee3)

**Plataforma integral de gestión logística y alquiler de flota de transporte**, desarrollada como proyecto final para la carrera de Ingeniería en Sistemas de Información (UTN - FRVM).

Este sistema no es solo un gestor de reservas; es una solución distribuida diseñada para manejar ciclos de vida de viajes complejos, gestión de activos (camiones/acoplados) y transacciones financieras seguras.

---

## 🚀 Características Principales

El sistema gestiona reglas de negocio avanzadas para una empresa de transporte nacional:

* **Arquitectura de Microservicios:** Desacople total entre la gestión de Unidades, Viajes, Usuarios y Cobros para mayor escalabilidad y tolerancia a fallos.
* **Gestión de Flota Inteligente:** Administración de estados técnicos (Disponible, En Viaje, De Baja) y tipos de carga (Cisternas, Frigoríficos, Granos, etc.).
* **Motor de Reservas y Ciclo de Vida:** Máquinas de estado para controlar el flujo del viaje: *Precargado -> Seña (10%) -> Confirmación Admin -> Pago Final -> En Viaje -> Finalizado*.
* **Integraciones Externas:**
    * **Mercado Pago:** Validación de tarjetas y split de pagos (seña vs. resto) mediante Webhooks.
    * **OSRM (Open Source Routing Machine):** Cálculo automático de distancias y costos de trayecto.
* **Seguridad:** Autenticación vía JWT y control de acceso basado en roles (Cliente, Chofer, Mecánico, Admin).

---

## 🛠️ Stack Tecnológico

Hemos seleccionado un stack moderno y robusto enfocado en la escalabilidad y el tipado fuerte:

* **Backend:** Framework **NestJS** (Node.js + TypeScript).
* **Frontend:** **Angular** (SPA).
* **Base de Datos:** **PostgreSQL** (gestionado con Supabase). Elegido por su integridad relacional y manejo de concurrencia.
* **Infraestructura:** Orquestación de contenedores con **Docker** y **Docker Compose**.

---

## 🏗️ Arquitectura del Sistema

El proyecto implementa una arquitectura de **Microservicios**:

1.  **Microservicio de Unidad:** Inventario físico (Camiones, Semirremolques).
2.  **Microservicio de Viaje:** Orquestador de lógica de negocio y planificación.
3.  **Microservicio de Cobro:** Lógica financiera aislada.
4.  **Microservicio de Usuarios:** Seguridad perimetral y Auth.
5.  **Gateway/Auth:** Manejo de Tokens JWT y Guards.

> *Decisión de Diseño:* Optamos por microservicios para permitir ciclos de despliegue independientes. Si el servicio de pagos falla (ej. API externa caída), la operativa logística de asignación de choferes no se detiene.

---

## 💻 Instalación y Ejecución

El proyecto está dockerizado para facilitar el despliegue en cualquier entorno.

### Prerrequisitos
* Docker & Docker Compose
* Node.js (LTS)

### Pasos
1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/EstebanAballay/ProyectoSeminario.git
    cd grafo-logistica
    ```
2. **Instalar librerias en el front:**
   Recuerda agregar el archivo CSS de Leaflet en el angular.json en la sección de styles:
   "node_modules/leaflet/dist/leaflet.css"
   Instalar en grafo-logistica/Frontend:
   ```bash
    npm install sweetalert2
    npm install leaflet @bluehalo/ngx-leaflet
    npm install axios
    ```
   
4. **Instalar librerias en el back:**
   Las librerías relacionadas a jwt irán en: grafo-logistica/Backend/apps/auth
   pdfmake se instalará en: grafo-logistica/Backend/apps/cobro
   La correspondiente a mercado pago se instalará en: grafo-logistica/Backend/apps/mercadopago
   TypeOrm irá en todos los microservicios que tengan entidades.
   ```bash
    npm install jsonwebtoken
    npm install @nestjs/jwt passport-jwt
    npm install pdfmake
    npm install @nestjs/typeorm typeorm pg
    npm install mercadopago
    ```
 
5.  **Configurar Variables de Entorno:**
    Renombrar el archivo `.env.example` a `.env` en cada microservicio y configurar las credenciales de base de datos y API Keys de Mercado Pago.

6.  **Levantar el Backend:**
    Ejecutar el script de orquestación en grafo-logistica/Backend:
    ```bash
    docker-compose up --build
    ```
    *Esto levantará simultáneamente los contenedores del Backend, Frontend y la conexión a la base de datos.*
    
7. **Ejecutar el Frontend**
   Ejecutar este comando en grafo-logistica/Frontend para ejecutar angular con certificado ssl local.
   ```bash
    ng serve --ssl
    ```
---

## 👥 Equipo de Desarrollo

Este proyecto fue desarrollado por el **Grupo P** de la UTN Facultad Regional Villa María:

* **Esteban Aballay**
* **Lourdes M. Bonino**
* **M. Virginia Colomer Prevotel**
* **Agustín Magallanes**
* **Santiago J. Mansilla**

---
*Desarrollado con ❤️ y mucho café para el Seminario Integrador 2026.*

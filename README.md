<<<<<<< HEAD
# Transporte

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.2.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
=======
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

2.  **Configurar Variables de Entorno:**
    Renombrar el archivo `.env.example` a `.env` en cada microservicio y configurar las credenciales de base de datos y API Keys de Mercado Pago.

3.  **Levantar el Backend:**
    Ejecutar el script de orquestación en grafo-logistica/Backend:
    ```bash
    docker-compose up --build
    ```
    *Esto levantará simultáneamente los contenedores del Backend, Frontend y la conexión a la base de datos.*
    
5. **Ejecutar el Frontend**
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
>>>>>>> 0c5d6f90eac202ef48af038ff39f6eb286018b72

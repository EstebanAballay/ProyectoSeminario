# 🚛 Grafo Logística

![NestJS](https://img.shields.io/badge/Backend-NestJS-red) ![Angular](https://img.shields.io/badge/Frontend-Angular-dd0031) ![PostgreSQL](https://img.shields.io/badge/DB-PostgreSQL-blue) ![Docker](https://img.shields.io/badge/DevOps-Docker-2496ed) ![Mercado Pago](https://img.shields.io/badge/Integration-Mercado%20Pago-009ee3)

[cite_start]**Comprehensive logistics management and fleet rental platform**, developed as the final project for the Information Systems Engineering degree at UTN - FRVM[cite: 2, 9, 11, 13].

[cite_start]This system is not just a booking manager; it is a distributed solution designed to handle complex trip lifecycles, asset management (trucks/trailers), and secure financial transactions [cite: 30-36].

---

## 🚀 Key Features

The system manages advanced business rules for a national transportation company:

* [cite_start]**Microservices Architecture:** Total decoupling between Unit, Trip, User, and Payment management for greater scalability and fault tolerance [cite: 512-516].
* [cite_start]**Smart Fleet Management:** Administration of technical states (Available, On Trip, Out of Service) and cargo types (Tankers, Refrigerated, Grains, etc.) [cite: 59-62, 37-39].
* [cite_start]**Booking Engine & Lifecycle:** State machines to control the trip flow: *Preloaded -> Deposit (10%) -> Admin Confirmation -> Final Payment -> On Trip -> Finished* [cite: 46-57].
* **External Integrations:**
    * [cite_start]**Mercado Pago:** Card validation and payment splitting (deposit vs. balance) via Webhooks[cite: 73, 528].
    * [cite_start]**OSRM (Open Source Routing Machine):** Automatic calculation of distances and trip costs[cite: 556].
* [cite_start]**Security:** JWT authentication and role-based access control (Client, Driver, Mechanic, Admin) [cite: 539-542].

---

## 🛠️ Tech Stack

We selected a modern and robust stack focused on scalability and strong typing:

* [cite_start]**Backend:** **NestJS** Framework (Node.js + TypeScript)[cite: 555].
* [cite_start]**Frontend:** **Angular** (SPA)[cite: 557].
* **Database:** **PostgreSQL** (managed by Supabase). [cite_start]Chosen for its relational integrity and concurrency handling [cite: 556, 585-587].
* [cite_start]**Infrastructure:** Container orchestration with **Docker** and **Docker Compose**[cite: 557].

---

## 🏗️ System Architecture

The project implements a **Microservices** architecture:

1.  [cite_start]**Unit Microservice:** Physical inventory (Trucks, Trailers)[cite: 520].
2.  [cite_start]**Trip Microservice:** Business logic and planning orchestrator[cite: 529].
3.  [cite_start]**Payment Microservice:** Isolated financial logic[cite: 525].
4.  [cite_start]**User Microservice:** Perimeter security and Auth[cite: 539].
5.  [cite_start]**Gateway/Auth:** JWT Token handling and Guards[cite: 543].

> *Design Decision:* We opted for microservices to allow independent deployment cycles. [cite_start]If the payment service fails (e.g., external API down), the logistics operation of assigning drivers does not stop [cite: 514-518].

---

## 💻 Installation & Execution

The project is dockerized to facilitate deployment in any environment.

### Prerequisites
* Docker & Docker Compose
* Node.js (LTS)

### Steps
1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/grafo-logistica.git](https://github.com/your-username/grafo-logistica.git)
    cd grafo-logistica
    ```

2.  **Configure Environment Variables:**
    Rename the `.env.example` file to `.env` in each microservice and configure the database credentials and Mercado Pago API Keys.

3.  **Launch Infrastructure:**
    Run the orchestration script:
    ```bash
    docker-compose up --build
    ```
    *This will simultaneously launch the Backend, Frontend, and Database connection containers.*

4.  **Access:**
    * Frontend: `http://localhost:4200`
    * API Gateway: `http://localhost:3000`

---

## 👥 Development Team

[cite_start]This project was developed by **Group P** from UTN Facultad Regional Villa María[cite: 3, 11]:

* [cite_start]**Esteban Aballay** [cite: 7]
* [cite_start]**Lourdes M. Bonino** [cite: 7]
* **M. [cite_start]Virginia Colomer Prevotel** [cite: 7]
* [cite_start]**Agustín Magallanes** [cite: 7]
* [cite_start]**Santiago J. Mansilla** [cite: 7]

---
*Developed with ❤️ and lots of coffee for the Integrative Seminar 2026.*

import { Injectable, NotFoundException } from '@nestjs/common';
import { EMPRESA_DATA } from './empresa.data';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cobro, tipoCobro } from './entities/cobro.entity';
import { Abonante } from './entities/abonante.entity';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';

@Injectable()
export class BillingService {

    constructor(
        @InjectRepository(Cobro) private readonly cobroRepo: Repository<Cobro>,
        @InjectRepository(Abonante) private readonly abonanteRepo: Repository<Abonante>
    ) {}

    async generarFactura(cobroId: number, viajeId: number): Promise<Buffer> {
        
        const cobro = await this.getCobro(cobroId); 
        const viaje = await this.getViaje(viajeId); 
        console.log('obtencion exitosa del cobro:', cobro.abonante);
        if (!cobro || !viaje) throw new NotFoundException('Cobro o Viaje no encontrado');

        // Determinar montos según si es Seña o Total
        const esSenia = cobro.tipo === 'senia'; 
        const montoPagado = Number(cobro.monto); 
        
        // Cálculos de IVA (10.5% Transporte)
        const tasaIva = 1.105;
        const netoGravado = Number((montoPagado / tasaIva).toFixed(2));
        const montoIva = Number((montoPagado - netoGravado).toFixed(2));

        // Generar filas de la tabla dinámicamente 
        const filasViaje = viaje.unidades.map((item, index) => {
            // Armamos la descripción de forma condicional para evitar los "undefined"
            const nombreCamion = item.camion?.tipoCamion?.nombre || 'Unidad';
            const nombreSemi = item.semiremolque?.tipo?.nombre ? ` + ${item.semiremolque.tipo.nombre}` : '';
            const nombreAcoplado = item.acoplado?.tipo?.nombre ? ` + ${item.acoplado.tipo.nombre}` : '';

            return  `
                <tr>
                    <td class="center">${index + 1}</td>
                    <td>Unidad: ${nombreCamion}${nombreSemi}${nombreAcoplado}</td>
                    <td class="right">$${item.subtotal*viaje.distancia}</td>
                    <td class="center">1</td> </tr>
                </tr>
                `}).join('');

        const filaSenia = esSenia ? `
            <tr>
                <td class="center">-</td>
                <td colspan="3" class="bold">SEÑA / ANTICIPO (10% del total)</td>
            </tr>
        ` : '';

        // Estructura HTML del PDF (Reemplaza el docDefinition)
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; margin: 0; padding: 20px; font-size: 13px; }
                .header-container { display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px; position: relative; }
                .company-info { width: 45%; }
                .invoice-info { width: 45%; text-align: right; }
                .factura-letter { position: absolute; left: 50%; transform: translateX(-50%); top: 0; border: 2px solid #000; padding: 10px 18px; font-size: 28px; font-weight: bold; background-color: #fff; text-align: center; }
                .factura-letter span { display: block; font-size: 10px; font-weight: normal; margin-top: 5px; }
                .company-name { font-size: 22px; font-weight: bold; margin-bottom: 8px; }
                .invoice-type { font-size: 22px; font-weight: bold; margin-bottom: 8px; }
                .client-container { border: 1px solid #000; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
                .client-row { margin-bottom: 5px; }
                .bold { font-weight: bold; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th { background-color: #eeeeee; text-align: left; padding: 10px; border: 1px solid #ccc; font-size: 12px; }
                td { padding: 10px; border: 1px solid #ccc; }
                .center { text-align: center; }
                .right { text-align: right; }
                .totals-container { display: flex; justify-content: flex-end; margin-top: 20px; }
                .totals-table { width: 300px; border: none; }
                .totals-table td { border: none; padding: 5px 10px; }
                .total-final { font-size: 16px; font-weight: bold; background-color: #eeeeee; border-top: 2px solid #000 !important; }
                .footer { text-align: center; font-size: 10px; font-style: italic; margin-top: 50px; color: #555; border-top: 1px solid #ccc; padding-top: 15px; }
            </style>
        </head>
        <body>
            <div class="header-container">
                <div class="company-info">
                    <div class="company-name">${EMPRESA_DATA.nombre}</div>
                    <div>Dirección: ${EMPRESA_DATA.direccion}</div>
                    <div>Tel: ${EMPRESA_DATA.telefono} | Email: ${EMPRESA_DATA.email}</div>
                    <div class="bold" style="margin-top: 5px;">I.V.A.: ${EMPRESA_DATA.condicionIva}</div>
                </div>
                
                <div class="factura-letter">
                    B
                    <span>Cód. 006</span>
                </div>

                <div class="invoice-info">
                    <div class="invoice-type">FACTURA B</div>
                    <div class="bold">N° 0001-${String(cobro.id || 1).padStart(8, '0')}</div>
                    <div>Fecha: ${new Date().toLocaleDateString('es-AR')}</div>
                    <div>CUIT: ${EMPRESA_DATA.cuit}</div>
                    <div>IIBB: ${EMPRESA_DATA.ingresosBrutos}</div>
                    <div>Inicio Actividad: ${EMPRESA_DATA.inicioActividad}</div>
                </div>
            </div>

            <div class="client-container">
                <div class="client-row"><span class="bold">Cliente:</span> ${cobro.abonante.nombre} ${cobro.abonante.apellido}</div>
                <div class="client-row"><span class="bold">DNI/CUIT:</span> ${cobro.abonante.numeroDocumento}</div>
                <div class="client-row"><span class="bold">Condición IVA:</span> Consumidor Final</div>
                <div class="client-row"><span class="bold">Dirección:</span> Avenida Universidad 123</div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th class="center" style="width: 5%;">#</th>
                        <th style="width: 55%;">Descripción</th>
                        <th class="right" style="width: 20%;">Importe</th>
                        <th class="center" style="width: 20%;">Cantidad</th>
                    </tr>
                </thead>
                <tbody>
                    ${filasViaje}
                    ${filaSenia}
                </tbody>
            </table>

            <div class="totals-container">
                <table class="totals-table">
                    <tr>
                        <td class="right">Neto Gravado:</td>
                        <td class="right">$${netoGravado}</td>
                    </tr>
                    <tr>
                        <td class="right">IVA (10.5%):</td>
                        <td class="right">$${montoIva}</td>
                    </tr>
                    <tr>
                        <td class="right total-final">TOTAL A PAGAR:</td>
                        <td class="right total-final">$${montoPagado}</td>
                    </tr>
                </table>
            </div>

            <div class="footer">
                Comprobante Autorizado. Esta factura incluye el IVA correspondiente según normativa vigente.
            </div>
        </body>
        </html>
        `;

        try {
            console.log('Iniciando Puppeteer para generar el PDF...');
            
            // Lanzamos el navegador invisible. Los args son clave para entornos de servidor/Linux
            const browser = await puppeteer.launch({
                headless: true,
                // ESTA ES LA CLAVE: Ignoramos el caché y apuntamos al binario de Alpine
                executablePath: '/usr/bin/chromium-browser',
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage','--disable-gpu','--single-process']
            });
            
            const page = await browser.newPage();
            
            // Cargamos el HTML en la página
            await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
            console.log('html cargado exitosamente');

            // Generamos el PDF
            const pdfUint8Array = await page.pdf({
                format: 'A4',
                printBackground: true, // Importante para que se vean los fondos grises de la tabla
                margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
            });

            await browser.close();

            // Convertimos la salida de Puppeteer (Uint8Array) a Buffer para Node.js
            const resultBuffer = Buffer.from(pdfUint8Array);
            console.log('¡PDF generado exitosamente con Puppeteer!');

            // Guardado en disco (Misma lógica que tenías)
            const nombreArchivo = `Factura_Viaje${viajeId}_Cobro${cobroId}.pdf`;
            const dirFacturas = path.join(__dirname, '..', 'Facturas');
            
            if (!fs.existsSync(dirFacturas)) {
                fs.mkdirSync(dirFacturas, { recursive: true });
            }
            
            const rutaDestino = path.join(dirFacturas, nombreArchivo);
            fs.writeFileSync(rutaDestino, resultBuffer);
            console.log(`✅ ¡Factura guardada físicamente en: ${rutaDestino}!`);
            
            return resultBuffer;

        } catch (error) {
            console.error('🚨 Error fatal al construir/guardar el documento PDF:', error);
            throw error;
        }
    }

    // Funciones originales mantenidas exactamente igual
    private async getCobro(cobroId: number) {
        const cobro = await this.cobroRepo.findOne({where: { id: Number(cobroId)},relations:['abonante']});
        console.log('el cobro es:', cobro)
        const abonanteId = (cobro.abonante as any).id || cobro.abonante;
        const abonante = await this.abonanteRepo.findOne({where:{id: abonanteId}});
        //asingo el objeto del abonante entero al cobro
        cobro.abonante = abonante;
        return cobro 
    }
  
    private async getViaje(id: number) {
        const viaje = await axios.get(`http://viaje-service:3004/viaje/viaje-con-unidades/${id}`)
        return viaje.data
    }
}
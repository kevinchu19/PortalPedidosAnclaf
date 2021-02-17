import { product } from "./product.model";

export class order {
    numeroCliente:string;
    razonSocial:string;
    direccionFacturacion: string;
    paisFacturacion: string;
    codigoPostalFacturacion: string;
    provinciaFacturacion: string;
    direccionEntrega: string;
    paisEntrega: string;
    codigoPostalEntrega: string;
    provinciaEntrega: string;
    listaPrecios: string;
    numeroDocumento:string;
    items: [{
        producto: product;
        cantidad: number;
        total: number;
    }]
}
import { product } from './product.model';

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
    item: {
        producto: product;
        cantidad: number;
    }
}
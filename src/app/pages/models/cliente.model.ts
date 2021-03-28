import { Provincia } from "./provincia.model";

export class cliente {
    id:string;
    razonSocial:string;
    tipoDocumento:string;
    numeroDocumento:string;
    direccionFacturacion:string;
    paisFacturacion:string;
    codigoPostalFacturacion:string;
    provinciaFacturacion:string;
    direccionEntrega:string;
    paisEntrega:string;
    codigoPostalEntrega:string;
    provinciaEntrega:string;
    listaPrecios:string;
    grupoBonificacion:string;
    transportistaRedespacho:string;
    idVendedor:string;
    provinciaFacturacionNavigation:Provincia;
}

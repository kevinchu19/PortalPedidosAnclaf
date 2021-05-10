import { cliente } from './cliente.model';
import { Provincia } from './provincia.model';
import { clientedireccionentrega } from './clientedireccionentrega.model';
import { product } from './product.model';
export class order {
    id: string;
    idCliente: string;
    idClienteEntrega: string;
    idEntrega: string;
    direccionEntrega: string;
    paisEntrega: string;
    codigoPostalEntrega: string;
    provinciaEntrega: string;
    listaPrecios: string;
    transportistaRedespacho: string;
    observacion: string;
    observacionLogistica: string;
    idVendedor: string;
    retiradeFabrica: number;
    esBarrioCerrado: number;
    fecha:Date;
    cliente: cliente;
    provinciaEntregaNavigation:Provincia;
    idEntregaNavigation:clientedireccionentrega;
    telefono:string;
    email:string;
    pagoEnEfectivo:number;
    acopio:number;
    direccionModificada:number;
    fechaDeEntrega:Date;
    items: [{    
                item: number;
                idProducto: string;
                cantidad: number;
                precio: number;
                bonificacion1: number;
                bonificacion2: number;
                bonificacion3: number;
                bonificacion4: number;
                bonificacion: number;
                idProductoNavigation:product;
            }]

}
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
    vendedor: string;
    retiradeFabrica: number;
    esBarrioCerrado: number;
    fecha:Date;
    items: [{    
                item: number;
                idProducto: string;
                cantidad: number;
                precio: number;
                bonificacion1: number;
                bonificacion2: number;
                bonificacion3: number;
                bonificacion: number;
            }]

}
export class order {
    
    IdCliente: string;
    IdClienteEntrega: string;
    IdEntrega: string;
    DireccionEntrega: string;
    PaisEntrega: string;
    CodigoPostalEntrega: string;
    ProvinciaEntrega: string;
    ListaPrecios: string;
    TransportistaRedespacho: string;
    Observacion: string;
    ObservacionLogistica: string;
    Vendedor: string;
    RetiradeFabrica: number;
    EsBarrioCerrado: number;
    Fecha:Date;
    Items: [{    
                Item: number;
                IdProducto: string;
                Cantidad: number;
                Precio: number;
                Bonificacion1: number;
                Bonificacion2: number;
                Bonificacion3: number;
            }]

}
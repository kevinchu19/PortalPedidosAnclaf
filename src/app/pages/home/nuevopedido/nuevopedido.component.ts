import { Component, OnInit } from '@angular/core';
import { order } from '../../models/order.model';
import { product } from '../../models/product.model';


@Component({
  selector: 'app-nuevopedido',
  templateUrl: './nuevopedido.component.html',
  styleUrls: ['./nuevopedido.component.css']
})
export class NuevopedidoComponent implements OnInit {

  currentStep:number = 1;
  order:order = { numeroCliente:"", razonSocial:"", direccionFacturacion: "", paisFacturacion: "", codigoPostalFacturacion: "",
                  provinciaFacturacion: "", direccionEntrega: "", paisEntrega: "", codigoPostalEntrega: "", provinciaEntrega: "",
                  listaPrecios: "", items:[{
                                            cantidad: 0, producto: { 
                                                                    codigo:"", descripcion: "", precio: 0
                                                                   }, total: 0
                                          }]
                  }
  
  constructor() {
    console.log(this.order.items);
   }

  ngOnInit(): void {
  }
  
  siguientePaso(valor:number){
    this.currentStep = this.currentStep + valor;
  }

  muestroDatosProducto(e:Event){
    console.log(e);
    
  }

  agregaProducto(){
    
    this.order.items.push({
      cantidad: 0,
      producto: {
        codigo:"",
        descripcion: "",
        precio: 0
      },
      total: 0
    });
  }
}

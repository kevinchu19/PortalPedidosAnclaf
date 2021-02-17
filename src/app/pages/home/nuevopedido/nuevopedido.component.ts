import { Component, OnInit } from '@angular/core';
import { order } from '../../models/order.model';
import { product } from '../../models/product.model';
import { NuevopedidoService } from '../../services/nuevopedido.service';
import { typeheadArray } from '../../../components/models/typeheadArray.model';
import { LEADING_TRIVIA_CHARS } from '@angular/compiler/src/render3/view/template';
import { VirtualTimeScheduler } from 'rxjs';
import { cliente } from '../../models/cliente.model';
import { clientedireccionentrega } from '../../models/clientedireccionentrega.model';


@Component({
  selector: 'app-nuevopedido',
  templateUrl: './nuevopedido.component.html',
  styleUrls: ['./nuevopedido.component.css']
})
export class NuevopedidoComponent implements OnInit {

  currentStep:number = 1;
  order:order = { numeroCliente:"", razonSocial:"", direccionFacturacion: "", paisFacturacion: "", codigoPostalFacturacion: "",
                  provinciaFacturacion: "", direccionEntrega: "", paisEntrega: "", codigoPostalEntrega: "", provinciaEntrega: "",
                  listaPrecios: "", numeroDocumento:"", items:[{
                                            cantidad: 0, producto: { 
                                                                    id:"", descripcion: "", precio: 0, bonificacion: 0
                                                                   }, total: 0
                                          }]
                  }
  
  constructor(private _nuevoPedidoService: NuevopedidoService) {
    
   }

  ngOnInit(): void {
  }
  
  siguientePaso(valor:number){
    this.currentStep = this.currentStep + valor;
  }

  muestroDatosProducto(e:typeheadArray, itemactual:number){
    
    console.log(itemactual);
    
    this._nuevoPedidoService.GetProducto(e.codigo)
                      .subscribe((resp:product) => 
                      {                                 
                        this.order.items[itemactual].producto =
                        {
                          id: resp.id,
                          descripcion: resp.descripcion,
                          precio: resp.precio,
                          bonificacion: resp.bonificacion
                        };
                      });

    
    
  }
  

  muestroDatosCliente(e:typeheadArray){
    
    
    this._nuevoPedidoService.GetCliente(e.codigo)
                      .subscribe((resp:cliente) => 
                      {                      
                        this.order.numeroCliente = resp.id;
                        this.order.razonSocial = resp.razonSocial;
                        this.order.numeroDocumento = resp.numeroDocumento;
                        this.order.direccionFacturacion = resp.direccionFacturacion; 
                        this.order.paisFacturacion= resp.paisFacturacion; 
                        this.order.codigoPostalFacturacion= resp.codigoPostalFacturacion;
                        this.order.provinciaFacturacion= resp.provinciaFacturacion; 
                        
                        this.order.direccionEntrega= resp.direccionEntrega; 
                        this.order.paisEntrega= resp.paisEntrega; 
                        this.order.codigoPostalEntrega= resp.codigoPostalEntrega; 
                        this.order.provinciaEntrega= resp.provinciaEntrega;

                        this.order.listaPrecios= resp.listaPrecios;
                      });
    
  }

  muestroDatosEntrega(e:typeheadArray){
    
    
    this._nuevoPedidoService.GetDireccionEntrega(e.codigo, this.order.numeroCliente)
                      .subscribe((resp:clientedireccionentrega) => 
                      {                      
                                  
                        this.order.direccionEntrega= resp.direccionEntrega; 
                        this.order.paisEntrega= resp.paisEntrega; 
                        this.order.codigoPostalEntrega= resp.codigoPostalEntrega; 
                        this.order.provinciaEntrega= resp.provinciaEntrega;
                        
                      });
    
  }

  agregaProducto(){
    
    this.order.items.push({
      cantidad: 0,
      producto: {
        id:"",
        descripcion: "",
        precio: 0,
        bonificacion: 0
      },
      total: 0
    });
    console.log(this.order.items);
    
  }

  cantidadChange(item:number){
    if (this.order.items[item].cantidad != null) {
      this.order.items[item].total = this.order.items[item].cantidad*this.order.items[item].producto.precio;
    }
    else {
      this.order.items[item].total = 0;
    }
    
  }

  borraItem(item:number){
    this.order.items.splice(item,1);
  }
  
}


/*
public formularioPedido = this._fb.group({
  
  numeroCliente:['',[Validators.required]], 
  razonSocial:['',[Validators.required]], 
  direccionFacturacion: ['',[Validators.required]], 
  paisFacturacion: ['',[Validators.required]], 
  codigoPostalFacturacion: ['',[Validators.required]],
  provinciaFacturacion: ['',[Validators.required]], 
  direccionEntrega: ['',[Validators.required]], 
  paisEntrega: ['',[Validators.required]], 
  codigoPostalEntrega: ['',[Validators.required]], 
  provinciaEntrega: ['',[Validators.required]],
  listaPrecios: ['',[Validators.required]], 
  items:  [{
            cantidad:  [0,[Validators.required]], 
            producto: { 
                  id:['',[Validators.required]], 
                  descripcion: ['',[Validators.required]], 
                  precio:  [0,[Validators.required]], 
                  bonificacion:  [0,[Validators.required]]
            }, 
            total:  [0,[Validators.required]]
  }]
});
*/
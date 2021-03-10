import { Component, OnInit } from '@angular/core';
import { order } from '../../models/order.model';
import { product } from '../../models/product.model';
import { NuevopedidoService } from '../../services/nuevopedido.service';
import { typeheadArray } from '../../../components/models/typeheadArray.model';
import { cliente } from '../../models/cliente.model';
import { clientedireccionentrega } from '../../models/clientedireccionentrega.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';


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
  
  public step1form = this.fb.group({
    items: this.fb.array([]),
  });

  newItem(): FormGroup {
    return this.fb.group({
      cantidad: 0,
      producto: "",
      precio: 0, 
      bonificacion: 0,
      total: 0
    })
  }


  public step2form = this.fb.group({ 
    numeroCliente: ['',Validators.required],
    codigoEntrega:[''],
    direccionEntrega:['',Validators.required],
    codigoPostalEntrega:['',Validators.required],
    provinciaEntrega: ['',Validators.required]
   });
   public step1FormSubmitted:boolean = false;
   public step2FormSubmitted:boolean = false;

  constructor(private _nuevoPedidoService: NuevopedidoService, private fb: FormBuilder) {
    
  }

  ngOnInit(): void {
  }
  
  siguientePaso(valor:number){
    console.log(this.step2form);
    
    if (valor > 0) {
      switch (this.currentStep) {
        case 1:
          this.step1FormSubmitted = true;
          this.currentStep = this.currentStep + valor;  
          break;
      
        case 2:
          this.step2FormSubmitted = true;
          if (this.step2form.valid) {
            this.currentStep = this.currentStep + valor;  
          }
          break;
      
        default:
          break;
      } 
    } else{
      this.step2FormSubmitted = false;
      this.currentStep = this.currentStep + valor;  
    }
    
    

    
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
                        this.order.numeroDocumento = resp.numeroDocumento;
                        this.order.direccionFacturacion = resp.direccionFacturacion; 
                        this.order.paisFacturacion= resp.paisFacturacion; 
                        this.order.codigoPostalFacturacion= resp.codigoPostalFacturacion;
                        this.order.provinciaFacturacion= resp.provinciaFacturacion; 
                        
                        this.step2form.get('direccionEntrega').setValue(resp.direccionEntrega); 
                        this.order.paisEntrega= resp.paisEntrega; 
                        this.step2form.get('codigoPostalEntrega').setValue(resp.codigoPostalEntrega);
                        this.step2form.get('provinciaEntrega').setValue(resp.provinciaEntrega);
                        this.order.listaPrecios= resp.listaPrecios;
                      });
    
  }

  muestroDatosEntrega(e:typeheadArray){
    
    
    this._nuevoPedidoService.GetDireccionEntrega(e.codigo, this.order.numeroCliente)
                      .subscribe((resp:clientedireccionentrega) => 
                      {                      
                        this.step2form.get('direccionEntrega').setValue(resp.direccionEntrega); 
                        this.order.paisEntrega= resp.paisEntrega; 
                        this.step2form.get('codigoPostalEntrega').setValue(resp.codigoPostalEntrega);
                        this.step2form.get('provinciaEntrega').setValue(resp.provinciaEntrega);
                      });
    
  }

  agregaProducto(){
    
    this.items.push(this.newItem());

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
    this.items.removeAt(item);
    this.order.items.splice(item,1);
  }
  
  campoNoValido(campo:string){
    if (this.step2form.get(campo).invalid && this.step2FormSubmitted) {
      return true;
    }else
    {
      return false;
    }
  }

  get items(): FormArray {
    return this.step1form.get("items") as FormArray
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
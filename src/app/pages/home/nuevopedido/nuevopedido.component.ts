import { Component, OnInit } from '@angular/core';
import { order } from '../../models/order.model';
import { product } from '../../models/product.model';
import { NuevopedidoService } from '../../services/nuevopedido.service';
import { typeheadArray } from '../../../components/models/typeheadArray.model';
import { cliente } from '../../models/cliente.model';
import { clientedireccionentrega } from '../../models/clientedireccionentrega.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-nuevopedido',
  templateUrl: './nuevopedido.component.html',
  styleUrls: ['./nuevopedido.component.css'],
  providers: [DatePipe]
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
    items: this.fb.array([],[Validators.required]),
  });

  newItem(): FormGroup {
    return this.fb.group({
      cantidad: [0,Validators.required],
      producto: ["",Validators.required],
      descripcion: [''],
      precio: 0, 
      bonificacion: 0,
      total: 0,
    },{
      validators: [this.cantidadMayorACero('cantidad')]
    });
  }


  public step2form = this.fb.group({ 
    fecha:[''],
    numeroCliente: ['',Validators.required],
    razonSocial:[''],
    numeroDocumento:[''],
    listaPrecios: [''],
    direccionFacturacion:[''],
    paisFacturacion:[''],
    codigoPostalFacturacion:[''],
    provinciaFacturacion:[''],
    codigoEntrega:[''],
    entregaDescripcion:[''],
    paisEntrega: [''],
    direccionEntrega:['',Validators.required],
    codigoPostalEntrega:['',Validators.required],
    provinciaEntrega: ['',Validators.required]
   });
   public step1FormSubmitted:boolean = false;
   public step2FormSubmitted:boolean = false;
   
   public myDate = new Date();

  constructor(private _nuevoPedidoService: NuevopedidoService, private fb: FormBuilder, private datePipe: DatePipe) {
    this.step2form.get('fecha').setValue(this.datePipe.transform(this.myDate, 'dd/MM/yyyy'));
  }

  ngOnInit(): void {
  }
  
  siguientePaso(valor:number){
    console.log(this.step2form);
     
    if (valor > 0) {
      switch (this.currentStep) {
        case 1:
          this.step1FormSubmitted = true;
          if (this.step1form.valid) {
            this.currentStep = this.currentStep + valor;  
          }
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
    
    this._nuevoPedidoService.GetProducto(e.codigo)
                      .subscribe((resp:product) => 
                      {                                 
                        this.items.controls[itemactual].get('descripcion').setValue(resp.descripcion);
                        this.items.controls[itemactual].get('precio').setValue(resp.precio);
                        this.items.controls[itemactual].get('bonificacion').setValue(resp.bonificacion);
                      });    
    
  }
  

  muestroDatosCliente(e:typeheadArray){
    
    
    this._nuevoPedidoService.GetCliente(e.codigo)
                      .subscribe((resp:cliente) => 
                      {                      
                        this.step2form.get('razonSocial').setValue(resp.razonSocial);
                        this.step2form.get('numeroDocumento').setValue(resp.numeroDocumento);
                        this.step2form.get('direccionFacturacion').setValue(resp.direccionFacturacion); 
                        this.step2form.get('paisFacturacion').setValue(resp.paisFacturacion); 
                        this.step2form.get('codigoPostalFacturacion').setValue(resp.codigoPostalFacturacion);
                        this.step2form.get('provinciaFacturacion').setValue(resp.provinciaFacturacion); 
                        this.step2form.get('listaPrecios').setValue(resp.listaPrecios);

                        this.step2form.get('paisEntrega').setValue(resp.paisEntrega); 
                        this.step2form.get('direccionEntrega').setValue(resp.direccionEntrega); 
                        this.step2form.get('codigoPostalEntrega').setValue(resp.codigoPostalEntrega);
                        this.step2form.get('provinciaEntrega').setValue(resp.provinciaEntrega);
                      });
    
  }

  muestroDatosEntrega(e:typeheadArray){
    
    
    this._nuevoPedidoService.GetDireccionEntrega(e.codigo, this.step2form.get('numeroCliente').value)
                      .subscribe((resp:clientedireccionentrega) => 
                      {                      
                        this.step2form.get('entregaDescripcion').setValue(resp.descripcion); 
                        this.step2form.get('paisEntrega').setValue(resp.paisEntrega); 
                        this.step2form.get('direccionEntrega').setValue(resp.direccionEntrega); 
                        this.step2form.get('codigoPostalEntrega').setValue(resp.codigoPostalEntrega);
                        this.step2form.get('provinciaEntrega').setValue(resp.provinciaEntrega);
                      });
    
  }

  agregaProducto(){
    
    this.step1FormSubmitted = false;
    this.items.push(this.newItem());
    
    let numeroItem = this.items.controls.length-1
    this.items.controls[numeroItem].get('cantidad').valueChanges.subscribe(selectedValue=>{
      let precio = this.items.controls[numeroItem].get('precio').value
      this.items.controls[numeroItem].get('total').setValue(selectedValue*precio)
    })

    
  }
  borraItem(item:number){
    this.items.removeAt(item);
   }
  
  campoNoValido(_formGroup:FormGroup,campo:string, submittedState:boolean){
    if (_formGroup.get(campo).invalid && submittedState) {
      return true;
    }else
    {
      return false;
    }
  }

  get items(): FormArray {
    return this.step1form.get("items") as FormArray
  }

  getItems(): FormArray {
    return this.step1form.get("items") as FormArray
  }

  cantidadMayorACero(cantidad:string){
    
    return (formGroup:FormGroup) =>{
      const cantidControl = formGroup.get(cantidad)
      if (cantidControl.value <= 0) {
        cantidControl.setErrors({cantidadMenorOIgualACero:true})
      }else{
        cantidControl.setErrors(null);
      }
    }
  }

  existenItems(){
    
    return (formGroup: FormGroup) =>{
      
      const cantidadItems = formGroup.get('items').length
      if (cantidadItems == 0) {
        
      }else{
        formGroup.setErrors({noHayItems:true})
        formGroup.setErrors(null);
      }
    }
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
import { Component, OnInit, ViewChild } from '@angular/core';
import { product } from '../../models/product.model';
import { NuevopedidoService } from '../../services/nuevopedido.service';
import { typeheadArray } from '../../../components/models/typeheadArray.model';
import { cliente } from '../../models/cliente.model';
import { clientedireccionentrega } from '../../models/clientedireccionentrega.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { TypeheadComponent } from '../../../components/typehead/typehead.component';
import { order } from '../../models/order.model';
import Swal from 'sweetalert2'

import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-nuevopedido',
  templateUrl: './nuevopedido.component.html',
  styleUrls: ['./nuevopedido.component.css'],
  providers: [DatePipe],
  
})
export class NuevopedidoComponent implements OnInit {

  
  @ViewChild ('provinciaEntrega') provinciaEntregaTypeheadComponent: TypeheadComponent
  @ViewChild ('provinciaFacturacion') provinciaFacturacionTypeheadComponent: TypeheadComponent
  @ViewChild ('cliente') clienteTypeheadComponent: TypeheadComponent
  @ViewChild ('transportistaRedespacho') transportistaRedespachoTypeheadComponent: TypeheadComponent

  public currentStep:number = 1;
  public total:number = 0;
  public grupoBonificacion: string = "";
  public listaPrecios: string = "";
  public order: order;
  
  public step1form = this.fb.group({
    numeroCliente: ['', Validators.required],
    numeroCliente_descripcion:[''],
    vendedor: [''],
    observacion: [''],
    items: this.fb.array([],[Validators.required]),
  });

  newItem(): FormGroup {
    return this.fb.group({
      cantidad: [0,Validators.required],
      producto: ["",Validators.required],
      producto_descripcion: [''],
      descripcion: [''],
      precio: 0, 
      bonificacion: [0],
      bonificacion1: [0],
      bonificacion2: [0],
      bonificacion3: [0],
      total: 0,
    },{
      validators: [this.numeroMayorACero('cantidad'), this.controlBonificacion('bonificacion')]
    });
  }


  public step2form = this.fb.group({ 
    fecha:[''],
    numeroDocumento:[''],
    direccionFacturacion:[''],
    paisFacturacion:[''],
    codigoPostalFacturacion:[''],
    provinciaFacturacion:[''],
    provinciaFacturacion_descripcion: [''],
    codigoEntrega:[''],
    codigoEntrega_descripcion:[''],
    paisEntrega: [''],
    direccionEntrega:['',Validators.required],
    codigoPostalEntrega:[''],
    provinciaEntrega: ['',Validators.required],
    provinciaEntrega_descripcion: [''],
    observacionLogistica: [''],
    transportistaRedespacho: [''],
    transportistaRedespacho_descripcion: [''],
    /***
    retiraDeFabrica:[false],
    esBarrioCerrado: [false]
     */
   });
   public step1FormSubmitted:boolean = false;
   public step2FormSubmitted:boolean = false;
   
   public myDate = new Date();

  constructor(private _nuevoPedidoService: NuevopedidoService, 
              private _authService: AuthService, 
              private fb: FormBuilder, 
              private datePipe: DatePipe,
              private router: Router,
              private _decimalPipe: DecimalPipe) {
     
    
    this.step2form.get('fecha').setValue(this.datePipe.transform(this.myDate), 'dd/MM/yyyy');
      
    let tokenDecoded:any = this.decodeTokenFromStorage()
    let cliente = "";
    let vendedor = "";

    if (tokenDecoded) {
      cliente = tokenDecoded.cliente
      if (cliente && cliente != "") {    
        setTimeout(() => {
          this.step1form.get('numeroCliente').setValue(cliente || ""); 
        }, 2000); 

        setTimeout(() => {
          this.clienteTypeheadComponent.seleccionaValor();
        }, 4000); 
      }else{        
        vendedor = tokenDecoded.vendedor
        setTimeout(() => {
          this.step1form.get('vendedor').setValue(vendedor || ""); 
        }, 2000); 

      }
    }
    
    
   
  }

  ngOnInit(): void {
    
  }
  
  siguientePaso(valor:number){
    
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
    
    this._nuevoPedidoService.GetProducto(e.codigo, this.listaPrecios,this.grupoBonificacion)
                      .subscribe((resp:product) => 
                      {                                 
                        this.items.controls[itemactual].get('descripcion').setValue(resp.descripcion);            
                        this.items.controls[itemactual].get('precio').setValue(resp.precio || 0);
                        this.items.controls[itemactual].get('bonificacion1').setValue(this._decimalPipe.transform(resp.bonificacion1 || 0,'1.2'));
                        this.items.controls[itemactual].get('bonificacion2').setValue(this._decimalPipe.transform(resp.bonificacion2 || 0,'1.2'));
                        this.items.controls[itemactual].get('bonificacion3').setValue(this._decimalPipe.transform(resp.bonificacion3 || 0,'1.2'));
                      });    
    
  }
  

  muestroDatosCliente(e:typeheadArray){
    
    
    this._nuevoPedidoService.GetCliente(e.codigo)
                      .subscribe(async (resp:cliente) => 
                      {                      
                        this.step1form.get('numeroCliente_descripcion').setValue(resp.razonSocial);
                        this.listaPrecios = resp.listaPrecios;                        
                        this.grupoBonificacion = resp.grupoBonificacion;
                        this.step2form.get('numeroDocumento').setValue(resp.numeroDocumento);
                        this.step2form.get('direccionFacturacion').setValue(resp.direccionFacturacion); 
                        this.step2form.get('paisFacturacion').setValue(resp.paisFacturacion); 
                        this.step2form.get('codigoPostalFacturacion').setValue(resp.codigoPostalFacturacion);
                        

                        this.step2form.get('provinciaFacturacion').setValue(resp.provinciaFacturacion); 
                        setTimeout(() => {
                          this.provinciaFacturacionTypeheadComponent.seleccionaValor();
                        }, 200);
                        
                        this.step2form.get('paisEntrega').setValue(resp.paisEntrega); 
                        this.step2form.get('direccionEntrega').setValue(resp.direccionEntrega); 
                        this.step2form.get('codigoPostalEntrega').setValue(resp.codigoPostalEntrega);
                        
                        this.step2form.get('provinciaEntrega').setValue(resp.provinciaEntrega);    
                        setTimeout(() => {
                          this.provinciaEntregaTypeheadComponent.seleccionaValor();
                        }, 200);
                        this.step2form.get('transportistaRedespacho').setValue(resp.transportistaRedespacho); 
                        setTimeout(() => {
                          this.transportistaRedespachoTypeheadComponent.seleccionaValor();
                        }, 200);
                         
                      });
    
  }

  muestroDatosEntrega(e:typeheadArray){
    
    
    this._nuevoPedidoService.GetDireccionEntrega(e.codigo, this.step1form.get('numeroCliente').value)
                      .subscribe((resp:clientedireccionentrega) => 
                      {                      
                        this.step2form.get('codigoEntrega_descripcion').setValue(resp.descripcion); 
                        this.step2form.get('paisEntrega').setValue(resp.paisEntrega); 
                        this.step2form.get('direccionEntrega').setValue(resp.direccionEntrega); 
                        this.step2form.get('codigoPostalEntrega').setValue(resp.codigoPostalEntrega);
                        this.step2form.get('provinciaEntrega').setValue(resp.provinciaEntrega);    
                        setTimeout(() => {
                          this.provinciaEntregaTypeheadComponent.seleccionaValor();
                        }, 50);
                        this.step2form.get('transportistaRedespacho').setValue(resp.transportistaRedespacho); 
                        setTimeout(() => {
                          this.transportistaRedespachoTypeheadComponent.seleccionaValor();
                        }, 50);
                      });
    
  }

  agregaProducto(){
    
    this.step1FormSubmitted = false;
    this.items.push(this.newItem());
    
    let numeroItem = this.items.controls.length-1
    this.items.controls[numeroItem].get('cantidad').valueChanges.subscribe(selectedValue=>{
      if (this.items.controls[numeroItem].get('cantidad').valid) {
        this.recalculoTotalItem(numeroItem)  
      }
      
    })

    this.items.controls[numeroItem].get('bonificacion1').valueChanges.subscribe(selectedValue=>{
      
      this.recalculoBonificacion(numeroItem)
    
    })
    
    this.items.controls[numeroItem].get('bonificacion').valueChanges.subscribe(selectedValue=>{
      if (this.items.controls[numeroItem].get('bonificacion').valid) {
        this.recalculoTotalItem(numeroItem)
      }
    })

    
  }

  recalculoBonificacion(numeroItem:number){
  
    let itemControl = this.items.controls[numeroItem]
    let precio = this.items.controls[numeroItem].get('precio').value    
    if (precio != 0) {
      let bonificaciones = [itemControl.get('bonificacion1').value || 0, itemControl.get('bonificacion2').value || 0, itemControl.get('bonificacion3').value || 0]
      let precioBonificado = bonificaciones.reduce((sum, current) => precio-(sum - sum*Math.abs(current)/100), precio)    
      this.items.controls[numeroItem].get('bonificacion').setValue(this._decimalPipe.transform(100-(precio-precioBonificado)/precio*100,'1.2'))
    }
    
  }

  recalculoTotalItem(numeroItem:number){
      let cantidad = this.items.controls[numeroItem].get('cantidad').value  
      let precio = this.items.controls[numeroItem].get('precio').value
      let bonificacion = this.items.controls[numeroItem].get('bonificacion').value
      this.items.controls[numeroItem].get('total').setValue(cantidad*(precio-precio*bonificacion/100))
      this.total = this.items.controls.reduce((sum,current)=>  sum + current.get('total').value , 0 );
  }
  borraItem(item:number){
    this.items.removeAt(item);
    this.total = this.items.controls.reduce((sum,current)=>  sum + current.get('total').value , 0 );
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

  numeroMayorACero(campo:string){
    
    
    return (formGroup:FormGroup) =>{
      const campoControl = formGroup.get(campo)
      if (campoControl.value <= 0) {
        campoControl.setErrors({numeroMenorOIgualACero:true})
      }else{
        campoControl.setErrors(null);
      }
    }
  }
  controlBonificacion(campo:string){
    
    return (formGroup:FormGroup) =>{
      const campoControl = formGroup.get(campo)
      if (campoControl.value > 100) {
        campoControl.setErrors({numeroMayorACien:true})
      }else{
        if (campoControl.value < 0) {
          campoControl.setErrors({numeroMenorOIgualACero:true})
        }else{
          campoControl.setErrors(null);
        }
      }

    }
  }
  graboPedido(){
       
    this.order =  new order();
    this.order.idCliente = this.step1form.value.numeroCliente,
    this.order.idClienteEntrega = this.step2form.value.clienteDireccionEntrega!='' ? this.step1form.value.numeroCliente : '',
    this.order.idEntrega = this.step2form.value.clienteDireccionEntrega,
    this.order.direccionEntrega = this.step2form.value.direccionEntrega,
    this.order.paisEntrega = this.step2form.value.paisEntrega,
    this.order.codigoPostalEntrega = this.step2form.value.codigoPostalEntrega,
    this.order.provinciaEntrega = this.step2form.value.provinciaEntrega,
    this.order.listaPrecios = this.listaPrecios,
    this.order.transportistaRedespacho = this.step2form.value.transportistaRedespacho,
    this.order.observacion = this.step1form.value.observacion,
    this.order.observacionLogistica = this.step2form.value.observacionLogistica,
    this.order.vendedor = this.step1form.value.vendedor,
    this.order.retiradeFabrica = this.step1form.value.retiraDeFabrica==true?1:0,
    this.order.esBarrioCerrado = this.step1form.value.esBarrioCerrado==true?1:0,
    this.order.fecha = this.step2form.value.fecha;
    this.order.items = [{item: 0,
                        idProducto: "",
                        cantidad: 0,
                        precio: 0,
                        bonificacion1: 0,
                        bonificacion2: 0,
                        bonificacion3: 0,
                        bonificacion: 0 }],
    
    this.order.items.splice(0,1);
    
    this.items.value.forEach((item,index) => {
      let itemForm = {
        item: index+1,
        idProducto: item.producto,
        cantidad: item.cantidad,
        precio: item.precio,
        bonificacion1: item.bonificacion1,
        bonificacion2: item.bonificacion2,
        bonificacion3: item.bonificacion3,
        bonificacion: item.bonificacion 
      }
      this.order.items.push(itemForm);
    
      
    })

    
    this._nuevoPedidoService.GraboPedido(this.order).subscribe(
      (resp:any) =>{
          Swal.fire({
            title: 'Pedido generado',
            text: `Se ha generado exitosamente el pedido número #${resp.id}`,
            icon: 'success',
            confirmButtonText: 'OK'
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              this.recargoNuevoPedido();
            } 
          })


      },err=>{
        Swal.fire({
          title: 'Ha ocurrido un error',
          text: 'Intente nuevamente en unos minutos',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
      
    )
    
  };        
  
  decodeTokenFromStorage():any {
   return this._authService.decodeTokenFromStorage();
  }  
  
  recargoNuevoPedido() {

    // save current route first
    const currentRoute = this.router.url;

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentRoute]);
    }); 
}
}

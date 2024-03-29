import { Component, OnInit, QueryList, ViewChild, ViewChildren, ElementRef } from '@angular/core';
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
import { PagesService } from '../../services/pages.service';
const PRODUCTO_FLETE = "SV    | 105";
const PRODUCTO_FLETE_KG = "SV    | 124";




@Component({
  selector: 'app-nuevopedido',
  templateUrl: './nuevopedido.component.html',
  styleUrls: ['./nuevopedido.component.css'],
  providers: [DatePipe],
  
})

export class NuevopedidoComponent implements OnInit {

  @ViewChild ('leyendaFabricacion') leyendaFabricacionElement: HTMLElement
  @ViewChild ('provinciaEntrega') provinciaEntregaTypeheadComponent: TypeheadComponent
  @ViewChild ('provinciaFacturacion') provinciaFacturacionTypeheadComponent: TypeheadComponent
  @ViewChild ('cliente') clienteTypeheadComponent: TypeheadComponent
  @ViewChild ('transportistaRedespacho') transportistaRedespachoTypeheadComponent: TypeheadComponent
  @ViewChildren ('productos') productosTypeheadComponent: QueryList<TypeheadComponent>;


  
  public currentStep:number = 1;
  public total:number = 0;
  public totalkg:number = 0;
  public minimoFleteKg = 250;
  public grupoBonificacion: string = "";
  public idVendedor: string = "";
  public listaPrecios: string = "";
  public order: order;
  public guardandoPedido:boolean =false;
  public leyendaMinimoKG:string = `Las entregas a partir de los ${this.minimoFleteKg}KG en vuestros locales serán sin costo, caso contrario tendrá un costo adicional sujeto a lista de precios vigente`
  
  public step1form = this.fb.group({
    numeroCliente: ['', Validators.required],
    numeroCliente_descripcion:[''],
    vendedor: [''],
    observacion: [''],
    pagoEnEfectivo: [false],
    acopio: [false],
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
      bonificacion4: [0],
      pesokg: [0],
      total: 0,
    },{
      validators: [this.numeroMayorACero('cantidad'), this.controlBonificacion('bonificacion'), this.controlBonificacionAdicional('bonificacion4')]
    });
  }
       
  public myDate = new Date();
  public fechaEntrega = new Date();
  


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
    retiraDeFabrica:[false],
    esBarrioCerrado: [false],
    telefono:['', [Validators.maxLength(30)] ],
    email:['', [Validators.email]],
    fechaDeEntrega: [''],
    modificarDireccion: [false]
   },{
    validators: [this.emailRequeridoClientes(), this.telefonoRequeridoClientes()]
  });
   public step1FormSubmitted:boolean = false;
   public step2FormSubmitted:boolean = false;

  constructor(private _nuevoPedidoService: NuevopedidoService, 
              private _authService: AuthService, 
              private fb: FormBuilder, 
              private datePipe: DatePipe,
              private router: Router,
              private _decimalPipe: DecimalPipe, 
              private _pagesService: PagesService) {
     
    this.fechaEntrega.setDate(this.myDate.getDate()+1).toString()
    
    this.step2form.get('fecha').setValue(this.datePipe.transform(this.myDate), 'dd/MM/yyyy');
    this.step2form.get('fechaDeEntrega').setValue(this.fechaEntrega, 'dd/MM/yyyy');    
      
    let tokenDecoded:any = this.decodeTokenFromStorage()
    let cliente = "";
    let vendedor = "";

    if (tokenDecoded) {
      cliente = tokenDecoded.cliente
      vendedor = tokenDecoded.vendedor
      if (cliente && cliente != "") {    
        //setTimeout(() => {
         // this.step1form.get('numeroCliente').setValue(cliente || ""); 
        //}, 2000); 

        setTimeout(() => {          
          this.clienteTypeheadComponent.seleccionaValor(cliente)
        }, 500); 

      }

      if (vendedor && vendedor != "") {

        this.idVendedor = vendedor;
      }
    }
    
    
   
  }

  ngOnInit(): void {
    this.agregaProducto()    
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
            setTimeout(() => {
              this.currentStep = this.currentStep + valor;  
            }, 1000); 
          }
          this.ValidoAgregadoFleteporKg(this.step2form.get('modificarDireccion').value, this.step2form.get('retiraDeFabrica').value)
          break;
      
        default:
          break;
      } 
    } else{
      this.step2FormSubmitted = false;
      this.currentStep = this.currentStep + valor;  
    }
    
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });

    
  }
  ValidoAgregadoFleteporKg(modificarDireccion:boolean, retiraDePlanta:boolean) {
    
    if (modificarDireccion== false && retiraDePlanta==false) {
      this.eliminaFletes();
      if (this.totalkg<this.minimoFleteKg) {       
        this.agregaFlete(PRODUCTO_FLETE_KG);
        Swal.fire({
          allowOutsideClick: false,
          title: 'Importante!',
          text: this.leyendaMinimoKG,
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }  
    }
    
  }

  muestroDatosProducto(e:typeheadArray, itemactual:number){
        
    this._nuevoPedidoService.GetProducto(e.codigo, this.listaPrecios,this.grupoBonificacion)
                      .subscribe((resp:product) => 
                      {                                 
                        this.items.controls[itemactual].get('descripcion').setValue(resp.descripcion);            
                        this.items.controls[itemactual].get('precio').setValue(resp.precio || 0);
                        this.items.controls[itemactual].get('bonificacion1').setValue(resp.bonificacion1 || 0);
                        this.items.controls[itemactual].get('bonificacion2').setValue(resp.bonificacion2 || 0);
                        this.items.controls[itemactual].get('bonificacion3').setValue(resp.bonificacion3 || 0);
                        this.items.controls[itemactual].get('pesokg').setValue(resp.pesokg || 0);
                         
                      });    
    
  }
  

  muestroDatosCliente(paramNumeroCliente:any){
    const numeroCliente = typeof(paramNumeroCliente) =="string"?paramNumeroCliente:paramNumeroCliente.codigo
      
    
    this._nuevoPedidoService.GetCliente(numeroCliente)
                      .subscribe(async (resp:cliente) => 
                      {                      
                        
                        this.step1form.get('numeroCliente_descripcion').setValue(resp.razonSocial);
                        this.listaPrecios = resp.listaPrecios;                        
                        this.grupoBonificacion = resp.grupoBonificacion;
                        this.idVendedor = resp.idVendedor;
                        this.step2form.get('numeroDocumento').setValue(resp.numeroDocumento);
                        this.step2form.get('direccionFacturacion').setValue(resp.direccionFacturacion); 
                        this.step2form.get('paisFacturacion').setValue(resp.paisFacturacion); 
                        this.step2form.get('codigoPostalFacturacion').setValue(resp.codigoPostalFacturacion);
                        

                        this.step2form.get('provinciaFacturacion').setValue(resp.provinciaFacturacion); 
                        //setTimeout(() => {
                          this.provinciaFacturacionTypeheadComponent.seleccionaValor(resp.provinciaFacturacion);
                        //}, 1500);
                        
                        this.step2form.get('paisEntrega').setValue(resp.paisEntrega); 
                        this.step2form.get('direccionEntrega').setValue(resp.direccionEntrega); 
                        this.step2form.get('codigoPostalEntrega').setValue(resp.codigoPostalEntrega);
                        
                        this.step2form.get('provinciaEntrega').setValue(resp.provinciaEntrega);    
                        //setTimeout(() => {
                          this.provinciaEntregaTypeheadComponent.seleccionaValor(resp.provinciaEntrega);
                        //}, 1500);
                        this.step2form.get('transportistaRedespacho').setValue(resp.transportistaRedespacho); 
                        //setTimeout(() => {
                          this.transportistaRedespachoTypeheadComponent.seleccionaValor(resp.transportistaRedespacho);
                        //}, 1500);
                         
                      });
    
  }

  muestroDatosEntrega(paramCodigoEntrega:any){
    
    
    const codigoEntrega = typeof(paramCodigoEntrega) =="string"?paramCodigoEntrega:paramCodigoEntrega.codigo
    
    this._nuevoPedidoService.GetDireccionEntrega(codigoEntrega, this.step1form.get('numeroCliente').value)
                      .subscribe((resp:clientedireccionentrega) => 
                      {                      
                        this.step2form.get('codigoEntrega_descripcion').setValue(resp.descripcion); 
                        this.step2form.get('paisEntrega').setValue(resp.paisEntrega); 
                        this.step2form.get('direccionEntrega').setValue(resp.direccionEntrega); 
                        this.step2form.get('codigoPostalEntrega').setValue(resp.codigoPostalEntrega);
                        this.step2form.get('provinciaEntrega').setValue(resp.provinciaEntrega);    
                        //setTimeout(() => {
                          this.provinciaEntregaTypeheadComponent.seleccionaValor(resp.provinciaEntrega);
                        //}, 750);
                        this.step2form.get('transportistaRedespacho').setValue(resp.transportistaRedespacho); 
                        //setTimeout(() => {
                          this.transportistaRedespachoTypeheadComponent.seleccionaValor(resp.transportistaRedespacho);
                        //}, 750);
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
    
    this.items.controls[numeroItem].get('bonificacion2').valueChanges.subscribe(selectedValue=>{
      
      this.recalculoBonificacion(numeroItem)
    
    })

    this.items.controls[numeroItem].get('bonificacion3').valueChanges.subscribe(selectedValue=>{
      
      this.recalculoBonificacion(numeroItem)
    
    })
    
    
    
    this.items.controls[numeroItem].get('bonificacion4').valueChanges.subscribe(selectedValue=>{
      
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
    
    let bonificaciones = [itemControl.get('bonificacion1').value || 0, 
                          itemControl.get('bonificacion2').value || 0, 
                          itemControl.get('bonificacion3').value || 0,
                          itemControl.get('bonificacion4').value || 0]      
    
    this.items.controls[numeroItem].get('bonificacion').setValue(this._decimalPipe.transform(this._pagesService.recalculoBonificacion(bonificaciones, precio)), '1.2');
  
    
  }

  recalculoTotalItem(numeroItem:number){
    let itemControl = this.items.controls[numeroItem]
      let cantidad = itemControl.get('cantidad').value  
      let precio = itemControl.get('precio').value
      let bonificaciones = [itemControl.get('bonificacion1').value || 0, 
                          itemControl.get('bonificacion2').value || 0, 
                          itemControl.get('bonificacion3').value || 0,
                          itemControl.get('bonificacion4').value || 0]  
      
      this.items.controls[numeroItem].get('total').setValue(this._pagesService.recalculoTotalItem(cantidad, precio, bonificaciones));
      this.total = this.items.controls.reduce((sum,current)=>  sum + current.get('total').value , 0 );
      this.totalkg = this.items.controls.reduce((sum,current)=>  sum + current.get('pesokg').value*current.get('cantidad').value , 0 );
  }
  
  borraItem(item:number){
    if (item>0) {
      
      this.items.removeAt(item);
      this.total = this.items.controls.reduce((sum,current)=>  sum + current.get('total').value , 0 );
      this.totalkg = this.items.controls.reduce((sum,current)=>  sum + current.get('pesokg').value*current.get('cantidad').value , 0 );
      
    }
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

  controlBonificacionAdicional(campo: string): any {
    return (formGroup:FormGroup) =>{
      const campoControl = formGroup.get(campo)

      if (campoControl.value > 10) {
        campoControl.setErrors({numeroMayorADiez:true})
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
    this.guardandoPedido = true;   
    this.order =  new order();
    this.order.idCliente = this.step1form.value.numeroCliente,
    this.order.idClienteEntrega = this.step2form.value.clienteDireccionEntrega!='' ? this.step1form.value.numeroCliente : '',
    this.order.idEntrega = this.step2form.value.clienteDireccionEntrega,
    this.order.direccionEntrega = this.step2form.value.direccionEntrega,
    this.order.paisEntrega = this.step2form.value.paisEntrega,
    this.order.codigoPostalEntrega = this.step2form.value.codigoPostalEntrega,
    this.order.provinciaEntrega = this.step2form.value.provinciaEntrega,
    this.order.listaPrecios = this.listaPrecios,
    this.order.transportistaRedespacho = this.step2form.value.transportistaRedespacho==''? null:this.step2form.value.transportistaRedespacho,
    this.order.observacion = this.step1form.value.observacion,
    this.order.observacionLogistica = this.step2form.value.observacionLogistica,
    this.order.idVendedor = this.idVendedor,
    this.order.retiradeFabrica = this.step2form.value.retiraDeFabrica==true?1:0,
    this.order.esBarrioCerrado = this.step2form.value.esBarrioCerrado==true?1:0,
    this.order.fecha = this.step2form.value.fecha;
    this.order.telefono = this.step2form.value.telefono;
    this.order.email = this.step2form.value.email;
    this.order.pagoEnEfectivo = this.step1form.value.pagoEnEfectivo==true?1:0,
    this.order.acopio = this.step1form.value.acopio==true?1:0,    
    this.order.direccionModificada = this.step2form.value.modificarDireccion==true?1:0,
    this.order.fechaDeEntrega = this.step2form.value.fechaDeEntrega;
  
    
    this.order.idUsuario = this.decodeTokenFromStorage().unique_name;
    this.order.items = [{item: 0,
                        idProducto: "",
                        cantidad: 0,
                        precio: 0,
                        bonificacion1: 0,
                        bonificacion2: 0,
                        bonificacion3: 0,
                        bonificacion4: 0,
                        bonificacion: 0,
                        idProductoNavigation:null}],
    
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
        bonificacion4: item.bonificacion4*-1,
        bonificacion: item.bonificacion ,
        idProductoNavigation:null
      }
      this.order.items.push(itemForm);
    
      
    })

    this._nuevoPedidoService.GraboPedido(this.order).subscribe(
      (resp:any) =>{
          Swal.fire({
            allowOutsideClick: false,
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

        this.guardandoPedido = false;
      },err=>{
        Swal.fire({
          title: 'Ha ocurrido un error',
          text: 'Intente nuevamente en unos minutos',
          icon: 'error',
          confirmButtonText: 'OK'
        })
        this.guardandoPedido = false;
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

  modificaDireccion(e:any){
    if (!e.target.checked) {
      const codigoEntrega = this.step2form.get('codigoEntrega').value == null|| 
        this.step2form.get('codigoEntrega').value == undefined?'':this.step2form.get('codigoEntrega').value
      
      if ( codigoEntrega != '') {               
        this.muestroDatosEntrega(codigoEntrega)
      }else{
        const numeroCliente = this.step1form.get('numeroCliente').value
        this.muestroDatosCliente(numeroCliente)
      }
      this.ValidoAgregadoFleteporKg(e.target.checked,this.step2form.get('retiraDeFabrica').value);
    }else{
      this.eliminaFletes();
      this.agregaFlete(PRODUCTO_FLETE);
    }
  }

  modificaRetiraEnPlanta(e:any){
    if (e.target.checked) {
      this.eliminaFletes();
    }
  }

  agregaFlete(codigoFlete:string){
    
    this.agregaProducto()
  
    this.items.controls[this.items.length-1].get("producto").setValue(codigoFlete);    
    this.items.controls[this.items.length-1].get("cantidad").setValue(1);
    
    setTimeout(() => {
      
      this.productosTypeheadComponent.last.seleccionaValor(codigoFlete);
      
    }, 500);     
    
  }

  dejoGuardar():boolean{
      if (this.guardandoPedido==true) {
        return false
      }

      if ( this.productosTypeheadComponent.last.cargando == true) {
        return false
      }
    
    
      return true
    
  }

  eliminaFletes(){
    console.log('Entra a borrar');
    
    this.borraItem(this.items.controls.findIndex(item=>item.get('producto').value == PRODUCTO_FLETE || item.get('producto').value == PRODUCTO_FLETE_KG));
  }
  validoItemDeshabilitado(numeroItem:number):boolean{
    
    if (numeroItem!=0){
      if (this.items.controls[numeroItem].get("producto").value == PRODUCTO_FLETE || this.items.controls[numeroItem].get('producto').value == PRODUCTO_FLETE_KG ) {
      
        return true;
      }
    }    

    return null;
  }
  

  emailRequeridoClientes(){
  
    return (formGroup:FormGroup) =>{
      const email = formGroup.get("email");
      
      if (email.value == "" && this.decodeTokenFromStorage().cliente != "") {
          email.setErrors({requerido:true})
      }else{
          email.setErrors(null);
        }        
      }

  }
  

  telefonoRequeridoClientes(){
  
    return (formGroup:FormGroup) =>{
      const telefono = formGroup.get("telefono");
      
      if (telefono.value == "" && this.decodeTokenFromStorage().cliente != "") {
        telefono.setErrors({requerido:true})
      }else{
        telefono.setErrors(null);
        }        
      }

    }

}

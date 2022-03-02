import { Component, OnInit } from '@angular/core';
import { ConsultapedidosService } from '../../services/consultapedidos.service';



import { order } from '../../models/order.model';
import { AuthService } from '../../../auth/services/auth.service';
import { FormBuilder } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { paginatedData } from '../../models/paginateddata.model';
import { PagesService } from '../../services/pages.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-consultapedidos',
  templateUrl: './consultapedidos.component.html',
  styleUrls: ['./consultapedidos.component.css']
})
export class ConsultapedidosComponent implements OnInit {

  cargandoNuevaBusqueda:boolean;
  pedidos: order[];
  currentPage:number = 1;
  totalPages:number;
  pageSize:number = 5;
  totalCount:number=0;
  pages:number[] = [];
  hasNext:boolean = false;
  hasPrevious:boolean = false;
  pedidoEnDetalle:order;
  tableParams:HttpParams = new HttpParams();

  public viendoDetalle:boolean = false;
  
  public parametrosForm = this.fb.group({
    idPedido: [''],
    fechaDesde: [''],
    fechaHasta:[''],
    numeroCliente: [this.decodeTokenFromStorage().cliente],
    numeroCliente_descripcion: ['']
  });

  constructor(private _consultaPedidoService: ConsultapedidosService,
              private _authService: AuthService,
              private fb: FormBuilder,
              private _decimalPipe: DecimalPipe, 
              private _pagesService: PagesService) {
    this.tableParams.append('idCliente',this.decodeTokenFromStorage().cliente);
    this.tableParams.append('idVendedor',this.decodeTokenFromStorage().vendedor);

  }

   ngOnInit():void {
    this.buscar();
  }
  

  buscar(){
    
    this.cargandoNuevaBusqueda = true;
    this.currentPage = 1;
    this.getPedidos(); 
  }
  calculaPaginator(){
    this.pages =[]
    for (let index = 1; index <= this.totalPages; index++) {
      this.pages.push(index);
    }
  }
  public getPedidos(){
    
    this._consultaPedidoService.GetPedidos(this.decodeTokenFromStorage().vendedor,
                                           this.parametrosForm.value.idPedido,
                                           this.parametrosForm.value.fechaDesde,
                                           this.parametrosForm.value.fechaHasta,
                                           this.parametrosForm.value.numeroCliente,
                                           this.currentPage.toString() ,this.pageSize.toString()).subscribe(
      (resp:paginatedData<order>) => {      
        this.pedidos = resp.data;
        this.totalCount = resp.totalCount;
        this.totalPages= resp.totalPages;
        this.hasNext = resp.hasNext;
        this.hasPrevious= resp.hasPrevious;
        if (this.cargandoNuevaBusqueda==true) {
         
          this.calculaPaginator();
          this.cargandoNuevaBusqueda = false;
        }
      }
    )
    
    
  }
  
  recalculaPagina(valor:number){
    this.currentPage = this.currentPage+valor;
    this.getPedidos()
  }

  decodeTokenFromStorage():any {
   
    return this._authService.decodeTokenFromStorage();
   }

  recalculoBonificacion(bonificaciones:number[], precio:number){
      
    return this._decimalPipe.transform((this._pagesService.recalculoBonificacion(bonificaciones, precio)), '1.2');
  
  }

  recalculoTotalItem(cantidad:number, precio:number, bonificaciones:number[]){
      
    return this._pagesService.recalculoTotalItem(cantidad, precio, bonificaciones);
    
  }
  
  calculoTotalPedido(pedido:order){
    
    return pedido.items.reduce((sum,current)=>  {

      let bonificaciones = [current.bonificacion1 || 0, 
                            current.bonificacion2 || 0, 
                            current.bonificacion3 || 0,
                            current.bonificacion4 || 0]      
      let precioBonificado = bonificaciones.reduce((sum, current) =>  sum-(sum*Math.abs(current)/100), current.precio)    

      return sum + current.cantidad*Math.round(precioBonificado*100)/100
    }, 0 );
  }
  verDetallePedido(pedido:order){
    this.viendoDetalle = true;
    this.pedidoEnDetalle = pedido;
    console.log(this.pedidoEnDetalle);
    
  }

  cerrarDetallePedido(){
    this.viendoDetalle = false;
  }
  
  get entregaFromPedido(){
    if (this.pedidoEnDetalle.idEntregaNavigation) {
      return this.pedidoEnDetalle.idEntregaNavigation.descripcion
    }
    return '';
  }


}

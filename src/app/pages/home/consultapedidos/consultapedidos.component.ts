import { Component, OnInit } from '@angular/core';
import { ConsultapedidosService } from '../../services/consultapedidos.service';

import { cliente } from '../../models/cliente.model';
import { order } from '../../models/order.model';
import { AuthService } from '../../../auth/services/auth.service';
import { FormBuilder } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { paginatedData } from '../../models/paginateddata.model';

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
              private _decimalPipe: DecimalPipe, ) { }

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

  calculoTotalPedido(pedido:order){
    return pedido.items.reduce((sum,current)=>  sum + current.cantidad*(current.precio-current.precio*current.bonificacion/100), 0 );
  }
  verDetallePedido(pedido:order){
    this.viendoDetalle = true;
    this.pedidoEnDetalle = pedido;
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

import { Component, OnInit, ViewChild } from '@angular/core';
import { ConsultapedidosService } from '../../services/consultapedidos.service';



import { order } from '../../models/order.model';
import { AuthService } from '../../../auth/services/auth.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { paginatedData } from '../../models/paginateddata.model';
import { PagesService } from '../../services/pages.service';
import { HttpParams } from '@angular/common/http';
import { TableFilteredComponent } from '../../../components/table-filtered/table-filtered.component';
import { TableFilteredService } from 'src/app/components/service/table-filtered.service';

@Component({
  selector: 'app-consultapedidos',
  templateUrl: './consultapedidos.component.html',
  styleUrls: ['./consultapedidos.component.css']
})
export class ConsultapedidosComponent implements OnInit {

  data: any;
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
  @ViewChild ('tableFiltered') tableFilteredComponent: TableFilteredComponent
  

  public dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  
  public viendoDetalle:boolean = false;
  
    constructor(private _consultaPedidoService: ConsultapedidosService,
              private _authService: AuthService,
              private fb: FormBuilder,
              private _decimalPipe: DecimalPipe, 
              private _pagesService: PagesService,
              private _tfService: TableFilteredService) {
    
    this.tableParams = this.tableParams.append('idCliente',this.decodeTokenFromStorage().cliente);
    this.tableParams = this.tableParams.append('idVendedor',this.decodeTokenFromStorage().vendedor);
    this.inicializoParametrosFechaConsulta(30);
        
    this.dateRange.get("start").valueChanges.subscribe(selectedValue=>{     
      this.recalcDateParams(selectedValue,this.dateRange.value.end)
    })

    this.dateRange.get("end").valueChanges.subscribe(selectedValue=>{
      this.recalcDateParams(this.dateRange.value.start,selectedValue)
    })
  
    const now = Date.now();
  }

   ngOnInit():void {
    this.recuperarDatos();
  }
  
  inicializoParametrosFechaConsulta(diasParaAtras:number){
        
    const fechaInicial = new Date(new Date(Date.now()).setDate(new Date(Date.now()).getDate()-diasParaAtras))
    const fechaFinal = new Date(Date.now());
    
    this.dateRange.get("start").setValue(fechaInicial);
    this.dateRange.get("end").setValue(fechaFinal);
    this.recalcDateParams(this.dateRange.value.start,this.dateRange.value.end)
  }

  recalcDateParams(dateStart:string, dateEnd:string){
    const datePipe = new DatePipe('en-US');
    
    const dateRangeStart = datePipe.transform(dateStart,'yyyy-MM-dd')
    const dateRangeEnd = datePipe.transform(dateEnd,'yyyy-MM-dd')
  
    
    if (dateRangeStart != null && dateRangeEnd != null) {
      this.tableParams = this.tableParams.append('fechaDesde',dateRangeStart)
      this.tableParams = this.tableParams.append('fechaHasta',dateRangeEnd)
    }
    
    this.recuperarDatos();
  }


  //public getPedidos(){
    
    //this._consultaPedidoService.GetPedidos(this.decodeTokenFromStorage().vendedor,
      //                                     this.parametrosForm.value.idPedido,
       //                                    this.parametrosForm.value.fechaDesde,
        //                                   this.parametrosForm.value.fechaHasta,
         //                                  this.parametrosForm.value.numeroCliente,
          //                                 this.currentPage.toString() ,this.pageSize.toString()).subscribe(
      //(resp:paginatedData<order>) => {      
       // this.pedidos = resp.data;
        //this.totalCount = resp.totalCount;
        //this.totalPages= resp.totalPages;
        //this.hasNext = resp.hasNext;
        //this.hasPrevious= resp.hasPrevious;
        //if (this.cargandoNuevaBusqueda==true) {
         
          //this.calculaPaginator();
          //this.cargandoNuevaBusqueda = false;
        //}
      //}
    //)
    
    
  //}
  
  public getPedido(id:string){
    this._consultaPedidoService.GetPedidoById(id).subscribe(
      (resp:order) =>{
        this.pedidoEnDetalle = resp
        this.viendoDetalle = true;    
      }
    )
  }

  public recuperarDatos(){
    this.cargandoNuevaBusqueda = true;
    this._tfService.getData('pedidos', this.tableParams).subscribe(
      (resp:any) => {          
        this.data = [...resp];
        this.tableParams = this.tableParams.delete('fechaDesde');
        this.tableParams = this.tableParams.delete('fechaHasta');
        this.cargandoNuevaBusqueda = false; 
      });
  }
  //recalculaPagina(valor:number){
  //this.currentPage = this.currentPage+valor;
  //this.getPedidos()
  //}

  decodeTokenFromStorage():any {
   
    return this._authService.decodeTokenFromStorage();
   }


  //Vista detalle de pedido

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
  verDetallePedido(id:string){
    this.getPedido(id);
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

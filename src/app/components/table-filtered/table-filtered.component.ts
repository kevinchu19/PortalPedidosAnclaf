//TODO: Estilos de la tabla


import {  AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { order } from '../../pages/models/order.model';

import { MatTableDataSource } from '@angular/material/table';
import { orderTF } from '../models/orderTF.model';
import { mapper } from '../automapper/automapper.model';
import { TableFilteredService } from '../service/table-filtered.service';

import { MatPaginator } from '@angular/material/paginator';



@Component({
  selector: 'app-table-filtered',
  templateUrl: './table-filtered.component.html',
  styleUrls: ['./table-filtered.component.css']
})
export class TableFilteredComponent implements OnInit, AfterViewInit {

  @Output("verDetallePedido") verDetallePedido: EventEmitter<string> = new EventEmitter();
  @Output("getFile") getFile: EventEmitter<string> = new EventEmitter();
  @Input() displayedColumnsTitles:string[];
  @Input() displayedColumns:string[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  @Input() set data(value:any[]) {

    this.dataSource = new MatTableDataSource<any>(value)
    this.dataSource.paginator = this.paginator;     
      
  };
  
  public dataSource = new MatTableDataSource<any>();
   
  constructor(private _tfService: TableFilteredService) {
    
    
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;     
  }


  ngOnInit(): void {}

  public handlePage(e:any){
    console.log(e);
  }
  //public getPedidos(){
    
    //this._consultaPedidoService.GetPedidos("042",
    //                                       "",
    //                                       "",
    //                                       "",
    //                                       "",
    //                                       "1","5").subscribe(
    //  (resp:paginatedData<order>) => {      
    //    this.dataSource.data = this.getOrderTF(resp.data);
    //    console.log(this.dataSource.data);
        
    //  }
   // )
 // }


  checkIfDate(date:any){
    return date instanceof Date
  }

  checkIfNumber(number:any){
    return number instanceof Number
  }
  getOrderTF(orderToMap:order[]): orderTF[]{
        
    return orderToMap.map( (o:order) => {
      
      return mapper.map(o, orderTF, order)
    })
  }  

  verDetalle(id:string){
    
    this.verDetallePedido.emit(id);
  }

  getArchivo(element:string){
    console.log(element);
    this.getFile.emit(element)
  }

  public doFilter = (value: string) => {
    
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  getColumnName(titulo:string){
    if (titulo== "lupa" || titulo=="pdffile"){
      return ""
    }else{
      return titulo
    }
  }

}



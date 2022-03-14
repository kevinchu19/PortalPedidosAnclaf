//TODO: Estilos de la tabla
//      Agregar lupita de consulta
//      Independizar el filtro de fechas

import {  Component, Input, OnInit, ViewChild } from '@angular/core';

import { order } from '../../pages/models/order.model';

import { MatTableDataSource } from '@angular/material/table';
import { orderTF } from '../models/orderTF.model';
import { mapper } from '../automapper/automapper.model';
import { TableFilteredService } from '../service/table-filtered.service';
import { HttpParams } from '@angular/common/http';

import { MatPaginator } from '@angular/material/paginator';



@Component({
  selector: 'app-table-filtered',
  templateUrl: './table-filtered.component.html',
  styleUrls: ['./table-filtered.component.css']
})
export class TableFilteredComponent implements OnInit {


  @Input() displayedColumnsTitles:string[];
  @Input() displayedColumns:string[];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() set data(value:any[]) {
    this.dataSource = new MatTableDataSource<any>(value)
    this.dataSource.paginator = this.paginator;
  };
  public dataSource = new MatTableDataSource<any>();

  

  
  constructor(private _tfService: TableFilteredService) {}



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
    console.log(orderToMap);
    
    return orderToMap.map( (o:order) => {
      console.log(mapper.map(o, orderTF, order));
      
      return mapper.map(o, orderTF, order)
    })
  }  



  public doFilter = (value: string) => {
    
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

}



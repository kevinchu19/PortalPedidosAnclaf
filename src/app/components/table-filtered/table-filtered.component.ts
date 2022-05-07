//TODO: Campos footer, calcularlos en funcion a displayedTotalColumns



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

  
  public dataSource = new MatTableDataSource<any>();

  @Output("verDetallePedido") verDetallePedido: EventEmitter<string> = new EventEmitter();
  @Output("getFile") getFile: EventEmitter<string> = new EventEmitter();
  @Input() displayedColumnsTitles:string[];
  @Input() displayedColumns:string[];
  @Input() displayedTotalColumns:string[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  @Input() set data(value:any[]) {

    this.dataSource = new MatTableDataSource<any>(value)
    this.dataSource.paginator = this.paginator;    
     
  
  };
  
   
  constructor(private _tfService: TableFilteredService) {
    
    
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;     
  }


  ngOnInit(): void {}

  public handlePage(e:any){
  }


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

  getArchivo(element:any){
  
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

  calculoCamposFooter(titulo:string){
    
    if (titulo=="Importe" ) {
      return this.getImporteTotal()
    }else{
      if (this.displayedColumnsTitles.indexOf(titulo)==0) {
        return "Total:"
      }
    }
    return ""
  }

  getImporteTotal() {
   return this.dataSource.filteredData? this.dataSource.filteredData.map(c=>Number(c.importeNacional)).reduce((acc, value) => acc + value, 0):0;
  }
}



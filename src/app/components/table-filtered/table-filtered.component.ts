//TODO: Estilos de la tabla
//      Agregar lupita de consulta
//      Independizar el filtro de fechas

import {  Component, Input, OnInit, Type, ViewChild } from '@angular/core';

import { order } from '../../pages/models/order.model';

import { MatTableDataSource } from '@angular/material/table';
import { orderTF } from '../models/orderTF.model';
import { mapper } from '../automapper/automapper.model';
import { TableFilteredService } from '../service/table-filtered.service';
import { HttpParams } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-table-filtered',
  templateUrl: './table-filtered.component.html',
  styleUrls: ['./table-filtered.component.css']
})
export class TableFilteredComponent implements OnInit {


  @Input() displayedColumnsTitles:string[];
  @Input() displayedColumns:string[];
  @Input() dataSourceUrl:string;  
  @ViewChild(MatPaginator) paginator: MatPaginator;

  
  public params: HttpParams = new HttpParams();
  public dataSource: MatTableDataSource<any>;

  public dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  constructor(private _tfService: TableFilteredService) {

    this.dateRange.get("start").valueChanges.subscribe(selectedValue=>{
      console.log(selectedValue);
      
      this.recuperarDatos(selectedValue,this.dateRange.value.end);
    })

    this.dateRange.get("end").valueChanges.subscribe(selectedValue=>{
      this.recuperarDatos(this.dateRange.value.start,selectedValue);
    })
   }

  

  ngOnInit(): void {
    this.recuperarDatos(this.dateRange.value.start,this.dateRange.value.end);
  }


  private recuperarDatos(dateStart:string, dateEnd:string){
    const datePipe = new DatePipe('en-US');
    
    const dateRangeStart = datePipe.transform(dateStart,'dd/MM/yyyy')
    const dateRangeEnd = datePipe.transform(dateEnd,'dd/MM/yyyy')
    console.log(dateRangeStart);
    console.log(dateRangeEnd);
    
    if (dateRangeStart != null && dateRangeEnd != null) {
      this.params = this.params.append('fechaDesde',dateRangeStart)
      this.params = this.params.append('fechaHasta',dateRangeEnd)
    }
    
    this._tfService.getData(this.dataSourceUrl, this.params).subscribe(
      (resp:any) => {          
        this.dataSource = new MatTableDataSource(resp)
        this.dataSource.paginator = this.paginator;
                
        this.params = this.params.delete('fechaDesde');
        this.params = this.params.delete('fechaHasta');
      }  
    );
  }

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



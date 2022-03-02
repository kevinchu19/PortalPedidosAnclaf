//TODO: Agregar logica para filtrar por fecha y regenerar datasource
//      Estilos de la tabla

import { Component, Input, OnInit, Type } from '@angular/core';

import { ConsultapedidosService } from 'src/app/pages/services/consultapedidos.service';
import { order } from '../../pages/models/order.model';
import { paginatedData } from '../../pages/models/paginateddata.model';
import { MatTableDataSource } from '@angular/material/table';
import { orderTF } from '../models/orderTF.model';
import { mapper } from '../automapper/automapper.model';
import { TableFilteredService } from '../service/table-filtered.service';
import { HttpParams } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';



@Component({
  selector: 'app-table-filtered',
  templateUrl: './table-filtered.component.html',
  styleUrls: ['./table-filtered.component.css']
})
export class TableFilteredComponent implements OnInit {


  @Input() displayedColumnsTitles:string[];
  @Input() displayedColumns:string[];
  @Input() dataSourceUrl:string;
  @Input() params: HttpParams

  constructor(private _tfService: TableFilteredService) { }

  public dataSource: MatTableDataSource<any>;

  public dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  ngOnInit(): void {
    this.params.append('fechaDesde',this.dateRange.value.start)
    this.params.append('fechaHasta',this.dateRange.value.end)
    this._tfService.getData(this.dataSourceUrl, this.params).subscribe(
      (resp:any) => {          
        this.dataSource = new MatTableDataSource(resp)
      }  
    );
    
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



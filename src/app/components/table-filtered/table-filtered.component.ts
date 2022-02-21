import { Component, OnInit } from '@angular/core';

import { ConsultapedidosService } from 'src/app/pages/services/consultapedidos.service';
import { order } from '../../pages/models/order.model';
import { paginatedData } from '../../pages/models/paginateddata.model';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-table-filtered',
  templateUrl: './table-filtered.component.html',
  styleUrls: ['./table-filtered.component.css']
})
export class TableFilteredComponent implements OnInit {

  constructor(private _consultaPedidoService: ConsultapedidosService) { }

  ngOnInit(): void {
    this.getPedidos();
  }

  public displayedColumns = ['id', 'idCliente', 'address', 'details', 'update', 'delete'];
  public dataSource = new MatTableDataSource<order>();

  public getPedidos(){
    
    this._consultaPedidoService.GetPedidos("042",
                                           "",
                                           "",
                                           "",
                                           "",
                                           "1","5").subscribe(
      (resp:paginatedData<order>) => {      
        this.dataSource.data = resp.data;
        console.log(this.dataSource.data);
        
      }
    )
    
    
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }


  public redirectToDetails = (id: string) => {
    
  }
  public redirectToUpdate = (id: string) => {
    
  }
  public redirectToDelete = (id: string) => {
    
  }


}

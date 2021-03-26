import { Component, OnInit } from '@angular/core';
import { ConsultapedidosService } from '../../services/consultapedidos.service';

import { cliente } from '../../models/cliente.model';
import { order } from '../../models/order.model';
import { AuthService } from '../../../auth/services/auth.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-consultapedidos',
  templateUrl: './consultapedidos.component.html',
  styleUrls: ['./consultapedidos.component.css']
})
export class ConsultapedidosComponent implements OnInit {

  pedidos: order[];
  currentPage:number;
  pageCount:number;
  skip:number = 0;
  take:number = 10;

  public parametrosForm = this.fb.group({
    fechaDesde: [''],
    fechaHasta:[''],
    numeroCliente: [''],
    numeroCliente_descripcion: ['']
  });

  constructor(private _consultaPedidoService: ConsultapedidosService,
              private _authService: AuthService,
              private fb: FormBuilder, ) { }

  ngOnInit(): void {
    console.log(this.decodeTokenFromStorage().vendedor=="");
    this.getPedidos();
  }
  

  getPedidos(){
    this._consultaPedidoService.GetPedidos(this.decodeTokenFromStorage().cliente, this.skip.toString() ,this.take.toString()).subscribe(
      (resp:order[]) => {
        this.pedidos = resp;
        this.pageCount = Math.floor(this.pedidos.length/this.take)+1;
      }
    )
    
  }
  
  siguientePaso(i:number){
    this.currentPage = this.currentPage+i;
    this.recalculaPagina();
  }

  recalculaPagina(){
    this.skip = (this.currentPage-1) * this.take;
  }

  decodeTokenFromStorage():any {
   
    return this._authService.decodeTokenFromStorage();
   }

  calculoTotalPedido(pedido:order){
    return pedido.items.reduce((sum,current)=>  sum + current.cantidad*(current.precio-current.precio*current.bonificacion/100), 0 );
  }

}

import { Component, OnInit } from '@angular/core';
import { ConsultapedidosService } from '../../services/consultapedidos.service';
import { PagesService } from '../../services/pages.service';
import { cliente } from '../../models/cliente.model';
import { order } from '../../models/order.model';

@Component({
  selector: 'app-consultapedidos',
  templateUrl: './consultapedidos.component.html',
  styles: [
  ]
})
export class ConsultapedidosComponent implements OnInit {

  pedidos: order[];

  constructor(private _consultaPedidoService: ConsultapedidosService,
              private _pagesService: PagesService) { }

  ngOnInit(): void {
    this._consultaPedidoService.GetPedidos(this.decodeTokenFromStorage().cliente).subscribe(
      (resp:order[]) => {
        this.pedidos = resp;
      }
    )
  }
  
  decodeTokenFromStorage():any {
    return this._pagesService.decodeTokenFromStorage();
   }

  calculoTotalPedido(pedido:order){
    return pedido.items.reduce((sum,current)=>  sum + current.cantidad*(current.precio-current.precio*current.bonificacion/100), 0 );
  }

}

import { Component, OnInit } from '@angular/core';
import { ConsultapedidosService } from '../../services/consultapedidos.service';

import { cliente } from '../../models/cliente.model';
import { order } from '../../models/order.model';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-consultapedidos',
  templateUrl: './consultapedidos.component.html',
  styles: [
  ]
})
export class ConsultapedidosComponent implements OnInit {

  pedidos: order[];

  constructor(private _consultaPedidoService: ConsultapedidosService,
              private _authService: AuthService) { }

  ngOnInit(): void {
    this._consultaPedidoService.GetPedidos(this.decodeTokenFromStorage().cliente).subscribe(
      (resp:order[]) => {
        this.pedidos = resp;
      }
    )
  }
  
  decodeTokenFromStorage():any {
    return this._authService.decodeTokenFromStorage();
   }

  calculoTotalPedido(pedido:order){
    return pedido.items.reduce((sum,current)=>  sum + current.cantidad*(current.precio-current.precio*current.bonificacion/100), 0 );
  }

}

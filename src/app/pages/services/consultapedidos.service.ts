import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ConsultapedidosService {

  constructor(private http:HttpClient) { }

  GetPedidos(idVendedor:string, 
              idPedido:string,
              fechaDesde:string,
              fechaHasta:string,
              idCliente:string,
              pageNumber:string, pageSize:string){
    
    let params = new HttpParams()
    params = params.append('idCliente', idCliente);
    params = params.append('idVendedor', idVendedor);
    params = params.append('idPedido', idPedido);
    params = params.append('fechaDesde', fechaDesde);
    params = params.append('fechaHasta', fechaHasta);
    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    
    
    return this.http.get( `${base_url}pedido` ,{params: params})
      
  }
}

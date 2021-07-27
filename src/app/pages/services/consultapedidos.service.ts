import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth/services/auth.service';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ConsultapedidosService {

  constructor(private http:HttpClient, private _authService:AuthService) { }

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
    
    const options = {params}
    
    return this.http.get( `${base_url}pedido`,options)
      
  }
}

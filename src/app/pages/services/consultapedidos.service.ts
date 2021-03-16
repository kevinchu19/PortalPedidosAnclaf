import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ConsultapedidosService {

  constructor(private http:HttpClient) { }

  GetPedidos(idCliente:string){
    
    let params = new HttpParams()
    params = params.append('idcliente', idCliente);
    params = params.append('skip', '0');
    params = params.append('take', '10');
    
    
    return this.http.get( `${base_url}pedido` ,{params: params})
      
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ConsultapedidosService {

  constructor(private http:HttpClient) { }

  GetPedidos(idCliente:string, skip:string, take:string){
    
    let params = new HttpParams()
    params = params.append('idcliente', idCliente);
    params = params.append('skip', skip);
    params = params.append('take', take);
    
    
    return this.http.get( `${base_url}pedido` ,{params: params})
      
  }
}

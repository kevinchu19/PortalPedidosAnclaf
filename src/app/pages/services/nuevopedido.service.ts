import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { order } from '../models/order.model';
import { AuthService } from '../../auth/services/auth.service';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class NuevopedidoService {

  constructor(private http:HttpClient, private _authService:AuthService) { }

  GetProducto(id:string, listaPrecios:string ,grupoBonificacion:string ){
    
    let params = new HttpParams()
    params = params.append('listaPrecios', listaPrecios);
    params = params.append('grupoBonificacion',grupoBonificacion);

    const options = {params: params, headers: this._authService.GetAuthorizationHeaders()}
    
    return this.http.get( `${base_url}producto/${id}`,options)
      
  }

  GetCliente(id:string){
    const options = {headers: this._authService.GetAuthorizationHeaders()} 
    
    return this.http.get( `${base_url}cliente/${id}`, options)
      
  }

  GetDireccionEntrega(id:string, cliente:string){
    const options = {headers: this._authService.GetAuthorizationHeaders()} 
    
    return this.http.get( `${base_url}clientedireccionesentrega/${id}/${cliente}`, options)
      
  }

  GraboPedido(pedido:order){
    const options = {headers: this._authService.GetAuthorizationHeaders()} 
    
    return this.http.post( `${base_url}pedido`,pedido, options)
      
  }

}

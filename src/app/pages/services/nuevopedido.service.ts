import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class NuevopedidoService {

  constructor(private http:HttpClient) { }

  GetProducto(id:string){
    
    let params = new HttpParams()
    params = params.append('listaPrecios', "01");
    
    return this.http.get( `${base_url}producto/${id}`,{params: params})
      
  }

  GetCliente(id:string){
    
    return this.http.get( `${base_url}cliente/${id}`)
      
  }

  GetDireccionEntrega(id:string, cliente:string){
    
    return this.http.get( `${base_url}clientedireccionesentrega/${id}/${cliente}`)
      
  }

}

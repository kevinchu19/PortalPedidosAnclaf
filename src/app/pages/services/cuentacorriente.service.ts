import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CuentacorrienteService {

  constructor(private http:HttpClient) {}
  
  getCuentaCorriente(cliente:string,idVendedor:string,fechaDesde:string,fechaHasta:string, soloPendientes:boolean){
    let params = new HttpParams() 
    params = params.append('cliente', cliente);
    params = params.append('idVendedor', idVendedor);
    params = params.append('fechaDesde', fechaDesde);
    params = params.append('fechaHasta', fechaHasta);

    const options = {params}
    return this.http.get( `${base_url}table/cuentacorriente${soloPendientes?"/pendientes":""}`, options)
  }

  getFile(){
    window.open(`${base_url}cuentacorriente/file`,"_blank_")
  }
}

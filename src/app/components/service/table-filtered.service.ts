import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ConsultapedidosService } from '../../pages/services/consultapedidos.service';

const base_url = environment.base_url+'table/';

@Injectable({
  providedIn: 'root'
})
export class TableFilteredService {

  constructor(private http:HttpClient) { }

  getData(url:string, params:HttpParams){

  
    const options = {params}
    console.log(params);
    
    return this.http.get( `${base_url+url}`, options)
  }
}

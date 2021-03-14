import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';


const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class TypeheadService {

  constructor(private http: HttpClient) { }
  
  GetValues(resource:string,termino:string, keyParameterValue:string=null){
    
    let params = new HttpParams()
    params = params.append('skip', '0');
    params = params.append('take', '40');
    params = params.append('termino', termino);
    if (keyParameterValue) {
      params = params.append('keyParameter', keyParameterValue);
    }
  
    
    return this.http.get( `${base_url}${ resource }`,{params: params})
      
  }
}

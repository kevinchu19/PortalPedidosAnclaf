import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { optionalParameters } from "../models/optionalParameters.model";
import { AuthService } from '../../auth/services/auth.service';

const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class TypeheadService {

  constructor(private http: HttpClient, private _authService:AuthService) { }
  
  GetValues(resource:string,termino:string, keyParameterValue:string=null, optionalParameters:optionalParameters[]){
    
    let params = new HttpParams()
    params = params.append('skip', '0');
    params = params.append('take', '40');
    params = params.append('termino', termino==null?' ':termino);

    if (keyParameterValue) {
      params = params.append('keyParameter', keyParameterValue);
    };
    
    if (optionalParameters) {
      optionalParameters.forEach(element => {
        params = params.append(element.key, element.value)
      });  
    }
    
    
    const options = {params: params, headers: this._authService.GetAuthorizationHeaders()}
    
    return this.http.get( `${base_url}${ resource }`,options)
      
  }
}

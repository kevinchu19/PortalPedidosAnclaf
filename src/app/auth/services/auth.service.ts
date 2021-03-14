import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../models/loginform.model';
import jwt_decode from 'jwt-decode';
import { cliente } from '../../pages/models/cliente.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  GetUsuario(formData: LoginForm){
    console.log(formData);
    
    return this.http.post(`${base_url}usuario/login`,formData)
      .pipe(
        tap((resp:any) => {          
          localStorage.setItem('token',resp.token);
          localStorage.setItem('cliente',jwt_decode(resp.token).cliente);
          localStorage.setItem('vendedor',jwt_decode(resp.token).vendedor);
        })
      )
  }
}

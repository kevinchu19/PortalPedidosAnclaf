import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../models/loginform.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  logOut(){
    localStorage.removeItem('token');
  }
  GetUsuario(formData: LoginForm){
    console.log(formData);
    
    return this.http.post(`${base_url}usuario/login`,formData)
      .pipe(
        tap((resp:any) => {          
          localStorage.setItem('token',resp.token);
          
        })
      )
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../models/loginform.model';
import jwt_decode from 'jwt-decode';
import { ChangePasswordForm } from '../models/changepassword.model';
import { Observable } from 'rxjs';
import { of } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  
  get token(){
    return localStorage.getItem('token') || '';
  }
  
  //GetAuthorizationHeaders():HttpHeaders{
    //let headers = new HttpHeaders()
    //headers = headers.append('Authorization', `bearer ${this.token}`)
    //return headers;
  //}

  logOut(){
    localStorage.removeItem('token');
  }

  GetUsuario(formData: LoginForm){
    
    return this.http.post(`${base_url}usuario/login`,formData)
      .pipe(
        tap((resp:any) => {          
          
          localStorage.setItem('token',resp.token);
          
        })
      )
  }


  ValidarToken():Observable<boolean>{

    return this.http.get(`${base_url}usuario/login/renew`).pipe(
      tap((resp:any)=>{
        localStorage.setItem('token',resp.token);
      }),
      map(resp => true),
      catchError(error => of(false))
    )
  }

  ChangePassword(formData: ChangePasswordForm){
     
    return this.http.patch(`${base_url}usuario/changepassword/${this.decodeTokenFromStorage().unique_name}`,formData)
  }

  decodeTokenFromStorage():any{
    let token = localStorage.getItem('token')
    if (token && token != "" ) {
      return jwt_decode(token)  
    }
    
  }  
}

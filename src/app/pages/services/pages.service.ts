import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class PagesService {

  constructor() { }

  decodeTokenFromStorage():any{
    let token = localStorage.getItem('token')
    if (token && token != "" ) {
      return jwt_decode(token)  
    }
    
  }  

}

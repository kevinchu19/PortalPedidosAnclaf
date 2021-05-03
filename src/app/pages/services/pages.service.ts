import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class PagesService {

  constructor() { }
  
  recalculoBonificacion(bonificaciones:number[], precio:number):number{
  
    if (precio != 0) {
      let precioBonificado = bonificaciones.reduce((sum, current) =>  sum-(sum*Math.abs(current)/100), precio)    
      return 100-(precioBonificado/precio)*100
    }
    
  }

  recalculoTotalItem(cantidad:number, precio:number, bonificaciones:number[]){
      let bonificacion = this.recalculoBonificacion(bonificaciones, precio);
      let total = cantidad*(precio-precio*bonificacion/100)

      return Math.round(total*100)/100;
  }
}

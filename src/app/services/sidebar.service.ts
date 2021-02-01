import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any[] = [
    {
      titulo: 'Pedidos',
      icono: 'mdi mdi-gauge',
      submenu: [
        {titulo: 'Nuevo pedido', url: '/home/nuevo-pedido'},
        {titulo: 'Consulta de pedidos realizados', url: '/home/consulta-pedidos'}
      ] 
    }
  ];
   
  constructor() { }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any[] = [
    {
      titulo: 'Pedidos',
      icono: 'mdi mdi-gauge',
      url: "",
      submenu: [
        {titulo: 'Nuevo pedido', url: '/home/nuevo-pedido'},
        {titulo: 'Consulta de pedidos realizados', url: '/home/consulta-pedidos'}
      ] 
    },
    {
      titulo: 'Consultas y sugerencias', 
      icono: 'mdi mdi-email',
      url: "https://docs.google.com/forms/d/e/1FAIpQLSenuE4aTGcKdCPzN5UsRzy2DFJxASUeFX8TzMedK14qyQbcQQ/viewform",
      submenu: [] ,
      newWindow:true
    },
    {
      titulo: 'Cuenta Corriente', 
      icono: 'mdi mdi-receipt',
      url: "/home/cuenta-corriente",
      submenu: [],
      newWindow:false
    }
  ];
   
  constructor() { }
}

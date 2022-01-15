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
      titulo: 'Quejas y Reclamos', 
      icono: 'mdi mdi-email',
      url: "https://docs.google.com/forms/d/e/1FAIpQLSenuE4aTGcKdCPzN5UsRzy2DFJxASUeFX8TzMedK14qyQbcQQ/viewform",
      submenu: [] 
    }
  ];
   
  constructor() { }
}

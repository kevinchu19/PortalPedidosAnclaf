import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.pdf_url

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any[] = [
    {
      titulo: 'Pedidos',
      
      icono: 'mdi mdi-shopping',
      url: "",
      submenu: [
        {titulo: 'Nuevo pedido', url: '/home/nuevo-pedido'},
        {titulo: 'Consulta de pedidos realizados', url: '/home/consulta-pedidos'}
      ] 
    },
    {
      titulo: 'Presupuestos',
      icono: 'mdi mdi-file-powerpoint',
      url: "",
      submenu: [
        {titulo: 'Nuevo presupuesto', url: '/home/nuevo-presupuesto'}
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
    ,
    {
      titulo: 'Lista de Precios Vigente', 
      icono: 'mdi mdi-file-pdf',
      url: `${base_url}listadepreciosvigente/file`,
      submenu: [],
      newWindow:true
    }
  ];
   
  constructor() { }
}

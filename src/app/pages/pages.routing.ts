import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { NuevopedidoComponent } from './home/nuevopedido/nuevopedido.component';
import { ConsultapedidosComponent } from './home/consultapedidos/consultapedidos.component';
import { AuthGuard } from '../guards/auth.guard';


const routes: Routes = [
    {
        path:'home', 
        component:PagesComponent,
        canActivate:[AuthGuard],
        children: [
          {path: '', component:HomeComponent, data:{titulo: 'Principal'}},
          {path: 'nuevo-pedido', component:NuevopedidoComponent, data: {titulo: 'Nuevo Pedido'}},
          {path: 'consulta-pedidos', component:ConsultapedidosComponent,data: {titulo: 'Consulta Pedidos'}}
        ]
      },
      
  
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {}

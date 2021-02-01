import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { NuevopedidoComponent } from './home/nuevopedido/nuevopedido.component';
import { ConsultapedidosComponent } from './home/consultapedidos/consultapedidos.component';


const routes: Routes = [
    {
        path:'home', 
        component:PagesComponent,
        children: [
          {path: '', component:HomeComponent},
          {path: 'nuevo-pedido', component:NuevopedidoComponent},
          {path: 'consulta-pedidos', component:ConsultapedidosComponent}
        ]
      },
      
  
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {}

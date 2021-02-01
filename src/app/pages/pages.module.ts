import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { NuevopedidoComponent } from './home/nuevopedido/nuevopedido.component';
import { ConsultapedidosComponent } from './home/consultapedidos/consultapedidos.component';
import { AppRoutingModule } from '../app-routing.module';



@NgModule({
  declarations: [
    PagesComponent,
    NuevopedidoComponent,
    ConsultapedidosComponent 
  ],
  exports: [
    PagesComponent 
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppRoutingModule
  ]
})
export class PagesModule { }

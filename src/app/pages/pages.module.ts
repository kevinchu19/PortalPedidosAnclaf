//Modulos angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

//Modulos KT
import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from '../app-routing.module';
import { ComponentsModule } from '../components/components.module';

//Paginas
import { PagesComponent } from './pages.component';
import { NuevopedidoComponent } from './home/nuevopedido/nuevopedido.component';
import { ConsultapedidosComponent } from './home/consultapedidos/consultapedidos.component';




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
    AppRoutingModule,
    FormsModule,
    ComponentsModule
  ]
})
export class PagesModule { }

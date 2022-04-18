//Modulos angular
import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";

//Modulos KT
import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from '../app-routing.module';
import { ComponentsModule } from '../components/components.module';

//Paginas
import { PagesComponent } from './pages.component';
import { NuevopedidoComponent } from './home/nuevopedido/nuevopedido.component';
import { ConsultapedidosComponent } from './home/consultapedidos/consultapedidos.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { CuentacorrienteComponent } from './home/cuentacorriente/cuentacorriente.component';


@NgModule({
  declarations: [
    PagesComponent,
    NuevopedidoComponent,
    ConsultapedidosComponent,
    CuentacorrienteComponent
  ],
  exports: [
    PagesComponent 
  ],
  providers:[
    DecimalPipe,
    {provide: MAT_DATE_LOCALE, useValue: 'es'}
  ]
  ,
  imports: [
    CommonModule,
    SharedModule,
    AppRoutingModule,
    FormsModule,
    ComponentsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule
  ]
})
export class PagesModule { }

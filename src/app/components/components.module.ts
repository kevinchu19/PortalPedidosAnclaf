//Modulos Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

//Componentes
import { TypeheadComponent } from './typehead/typehead.component';




@NgModule({
  declarations: [
    TypeheadComponent
  ],
  exports:[
    TypeheadComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class ComponentsModule { }

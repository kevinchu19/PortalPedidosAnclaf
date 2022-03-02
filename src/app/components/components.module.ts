//Modulos Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import {MatDatepickerModule} from '@angular/material/datepicker';

//Componentes
import { TypeheadComponent } from './typehead/typehead.component';
import { TableFilteredComponent } from './table-filtered/table-filtered.component';
import { MatNativeDateModule } from '@angular/material/core';




@NgModule({
  declarations: [
    TypeheadComponent,
    TableFilteredComponent
  ],
  exports:[
    TypeheadComponent,
    TableFilteredComponent,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class ComponentsModule { }

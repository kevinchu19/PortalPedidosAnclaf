//Modulos Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';

//Componentes
import { TypeheadComponent } from './typehead/typehead.component';
import { TableFilteredComponent } from './table-filtered/table-filtered.component';
import { MatNativeDateModule } from '@angular/material/core';
import { CustomPaginationLabels } from './table-filtered/CustomPaginationLabels';
import { TableFilteredPipe } from './pipes/table-filtered.pipe';






@NgModule({
  declarations: [
    TypeheadComponent,
    TableFilteredComponent,
    TableFilteredPipe
  ],
  providers: [
    { provide: MatPaginatorIntl, 
      useClass: CustomPaginationLabels
    }
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
    MatNativeDateModule,
    MatPaginatorModule
 
  ]
})
export class ComponentsModule { }

// TODO: Recibir como parametro tipo de dato para hacer la transformacion
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tableFiltered'
})
export class TableFilteredPipe implements PipeTransform {

  transform(value: string, titulo:string): any {
       
      
      if (titulo != 'Importe') {
        return value
      }
      
      
      let nf = new Intl.NumberFormat('en-US');
      
      return '$' + nf.format(parseFloat(value)).toString()
  
    }
  }



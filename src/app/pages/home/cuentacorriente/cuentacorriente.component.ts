

import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CuentacorrienteService } from '../../services/cuentacorriente.service';

@Component({
  selector: 'app-cuentacorriente',
  templateUrl: './cuentacorriente.component.html',
  styleUrls: ['./cuentacorriente.component.css']
})
export class CuentacorrienteComponent implements OnInit {
  public cargandoNuevaBusqueda:boolean;
  public data:any;
  public soloPendientes:boolean;

  public fechaMovimientoRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  
  public parametrosCuentaCorriente = this.fb.group({
    soloPendientes: [false]
  });


  constructor(private _authService:AuthService, private _cuentaCorrienteService:CuentacorrienteService, private fb: FormBuilder, ) {
    this.inicializoParametrosFechaConsulta(90);
    
    this.fechaMovimientoRange.get("start").valueChanges.subscribe(selectedValue=>{     
      this.recalcDateParams(selectedValue,this.fechaMovimientoRange.value.end)
    })

    this.fechaMovimientoRange.get("end").valueChanges.subscribe(selectedValue=>{
      this.recalcDateParams(this.fechaMovimientoRange.value.start,selectedValue)
    })
    
    this.parametrosCuentaCorriente.get("soloPendientes").valueChanges.subscribe(selectedValue=>{
      this.soloPendientes = selectedValue;
      this.recalcDateParams(this.fechaMovimientoRange.value.start, this.fechaMovimientoRange.value.end)
      
    })
    

   }

  

  ngOnInit(): void {
    //this.recuperarDatos(this.decodeTokenFromStorage().cliente)
  }

  inicializoParametrosFechaConsulta(diasParaAtras:number){
        
    const fechaInicial = new Date(new Date(Date.now()).setDate(new Date(Date.now()).getDate()-diasParaAtras))
    const fechaFinal = new Date(Date.now());
    
    this.fechaMovimientoRange.get("start").setValue(fechaInicial);
    this.fechaMovimientoRange.get("end").setValue(fechaFinal);
    this.recalcDateParams(this.fechaMovimientoRange.value.start,this.fechaMovimientoRange.value.end)
  }

  recalcDateParams(dateStart:string, dateEnd:string){
    const datePipe = new DatePipe('en-US');
    
    const dateRangeStart = datePipe.transform(dateStart,'yyyy-MM-dd')
    const dateRangeEnd = datePipe.transform(dateEnd,'yyyy-MM-dd')
  
    
    if (dateRangeStart != null && dateRangeEnd != null) {
      this.recuperarDatos(this.decodeTokenFromStorage().cliente, this.decodeTokenFromStorage().vendedor, dateRangeStart, dateRangeEnd);
    }
    
  }

  recuperarDatos(cliente:string,idVendedor:string, fechaDesde:string, fechaHasta:string) {
    this._cuentaCorrienteService.getCuentaCorriente(cliente,idVendedor, fechaDesde, fechaHasta, this.soloPendientes).subscribe(
      (resp:any)=>{
        this.data = resp;
        
      }
    )
  }

  decodeTokenFromStorage():any {
      
    return this._authService.decodeTokenFromStorage();
   }

  getFile(e:any){
       
    this._cuentaCorrienteService.getFile(e.pdfPath);
  }

  calculaCamposTabla(tipo:string){
    const TITULOS_COLUMNAS = {
      titulos:  ['Razón social','Codigo de comprobante', 'Número de comprobante', 
      'Fecha de movimiento', 'Fecha de vencimiento', 'Importe','pdffile'],
      columnas: ['razonSocial','codigoFormulario', 'numeroFormulario', 'fechaMovimiento', 'fechaVencimiento', 'importeNacional','pdffile'],
      totales: ['importeNacional']
    } 

    let resultado = TITULOS_COLUMNAS[tipo]
  
    if (this.decodeTokenFromStorage().cliente != "") {
      
      var eliminado = resultado.shift();
    }
    
    return resultado;
  }

}


//TODO: Implementar unsubscribe 
import { Component, OnInit, Output,EventEmitter, Input, OnDestroy } from '@angular/core';
import { typeheadArray } from '../models/typeheadArray.model';
import { TypeheadService } from '../service/typehead.service';
import { FormGroup } from '@angular/forms';
import { delay } from 'rxjs/operators';


@Component({
  selector: 'app-typehead',
  templateUrl: './typehead.component.html',
  styleUrls: ['./typehead.component.css']
})
export class TypeheadComponent implements OnInit {
  
  @Input() parentForm:FormGroup;
  @Input() campoFormulario:string;
  @Input() keyParameterValue:string;
  @Input() resource:string;
  @Input() placeholder:string;
  @Output() valorSeleccionado: EventEmitter<typeheadArray> = new EventEmitter();
  
  
  public terminoInput:string = "";
  public arrayOriginal: typeheadArray[] = [];
  public arrayMostrado: typeheadArray[] = []
  public itemMouseOver: number = 0
  public valorCorrecto: boolean = false;

  constructor( private _typeheadService: TypeheadService) { }

  ngOnInit(): void {
    
    this.parentForm.get(this.campoFormulario).valueChanges.subscribe(selectedValue=>{
            
      this.terminoInput = this.parentForm.get(this.campoFormulario).value;
      console.log(this.valorCorrecto);
            
      if (this.terminoInput != '' && !this.valorCorrecto) {
      
        this._typeheadService.GetValues(this.resource, this.terminoInput.toUpperCase(), this.keyParameterValue)
                      .subscribe((resp:any[]) => 
                                  {                   
                                    console.log(resp);
                                                  
                                    this.arrayMostrado = [];
                                    resp.forEach(element => {
                                      this.arrayMostrado.push({
                                        codigo:element.id,
                                        descripcion: element.descripcion,
                                        mouseOver: false
                                      })
                                    });
                                    this.itemMouseOver = 0;
                                  }
      
                                 ); 
                                 
         
        this.parentForm.get(this.campoFormulario).setValidators([(formGroup:FormGroup)=> {
          if (this.valorCorrecto === false) {
            return {valorInvalido:true}
          }else{
            return null
          }
        }]);  
      
      }else {
        this.parentForm.get(this.campoFormulario).setValidators([(formGroup:FormGroup)=> {return null}]);
      }
      
      
      this.parentForm.get(this.campoFormulario).updateValueAndValidity({onlySelf:true, emitEvent:false});        
    
      
    });
  }

  

  seleccionaValor(){    
    this.valorCorrecto = true;
    console.log(this.arrayMostrado);
    
    let item = this.itemMouseOver;
    this.parentForm.get(this.campoFormulario +'_descripcion').setValue(this.arrayMostrado[item].descripcion);
    this.parentForm.get(this.campoFormulario).setValue (this.arrayMostrado[item].codigo);    
    
    this.parentForm.get(this.campoFormulario).setValidators([(formGroup:FormGroup)=> null]);
    this.parentForm.get(this.campoFormulario).updateValueAndValidity({onlySelf:true});
    this.valorSeleccionado.emit(this.arrayMostrado[item]);
    this.arrayMostrado = [];

    this.valorCorrecto = false;
    console.log('falso');
  }

  keyUp(e:KeyboardEvent){
    switch (e.key) {
      case "ArrowDown":
        this.sacoFocoMouse(this.itemMouseOver);
        if (this.itemMouseOver < this.arrayMostrado.length-1) {
          this.itemMouseOver = this.itemMouseOver + 1  
        }
        this.pongoFocoMouse(this.itemMouseOver)  
        break;
      case "ArrowUp":
        this.sacoFocoMouse(this.itemMouseOver);
        if (this.itemMouseOver > 0) {
          this.itemMouseOver = this.itemMouseOver - 1  
        }
        this.pongoFocoMouse(this.itemMouseOver)
        break;
      case "Enter":
          this.seleccionaValor();
      default:
        break;
    }

    
  }
  mouseOver(a:typeheadArray){
    this.itemMouseOver = this.arrayMostrado.indexOf(a);
  }

  focusOut(e:FocusEvent){
    this.arrayMostrado = []
  }
  private pongoFocoMouse(item:number){
    if (this.arrayMostrado) {
      this.arrayMostrado[item].mouseOver = true
    }
  }

  private sacoFocoMouse(item:number){   
    if (this.arrayMostrado) {
      this.arrayMostrado[item].mouseOver = false  
    }
    
  }

  
}

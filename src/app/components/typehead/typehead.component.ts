
//TODO: Implementar unsubscribe 
import { Component, OnInit, Output,EventEmitter, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { typeheadArray } from '../models/typeheadArray.model';
import { TypeheadService } from '../service/typehead.service';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { optionalParameters } from '../models/optionalParameters.model';
import { debounce, debounceTime, map } from 'rxjs/operators';
import { EMPTY, timer } from 'rxjs';


@Component({
  selector: 'app-typehead',
  templateUrl: './typehead.component.html',
  styleUrls: ['./typehead.component.css']
})
export class TypeheadComponent implements OnInit {
  
  @ViewChild('scroll') private myScrollContainer: ElementRef;

  @Input() parentForm:FormGroup;
  @Input() campoFormulario:string;
  @Input() keyParameterValue:string;
  @Input() resource:string;
  @Input() placeholder:string;
  @Input() disabled:boolean;
  @Input() optionalParameters:optionalParameters[];

  @Output() valorSeleccionado: EventEmitter<typeheadArray> = new EventEmitter();
  
  public cargando:boolean = false;
  public terminoInput:string = "";
  public arrayOriginal: typeheadArray[] = [];
  public arrayMostrado: typeheadArray[] = []
  public itemMouseOver: number = 0
  public valorCorrecto: boolean = false;

  constructor( private _typeheadService: TypeheadService, private el: ElementRef) { }

  ngOnInit(): void {
    

    let campoRequerido = this.hasRequiredField(this.parentForm.get(this.campoFormulario))
    
    
    this.parentForm.get(this.campoFormulario).valueChanges.pipe(
      map((e:any) => e),
      
      debounce( ev =>!this.valorCorrecto?timer(500):EMPTY)
      ).subscribe(selectedValue=>{
      
      let validators = [];

      if (campoRequerido) {        
        validators.push(Validators.required)
      }      
      this.terminoInput = this.parentForm.get(this.campoFormulario).value;
            
    
      if (this.terminoInput != '' && this.terminoInput && !this.valorCorrecto) {
        
        this.recuperoValores();
         
        this.parentForm.get(this.campoFormulario).setValidators([(formGroup:FormGroup)=> {
          if (this.valorCorrecto === false) {
            validators.push({valorInvalido:true})
          }
          return validators;  
        }]);  
      
      }else{
        if (this.terminoInput=='') {
          this.parentForm.get(this.campoFormulario).setValidators([(formGroup:FormGroup)=> {
            return validators;  
          }]);  
        }
      }
    
      this.parentForm.get(this.campoFormulario).updateValueAndValidity({onlySelf:true, emitEvent:false});        
      
    });
  }

  

  seleccionaValor(){    
    
    if (this.arrayMostrado.length > 0) {
      this.valorCorrecto = true;
      
      let item = this.itemMouseOver;
  
      this.parentForm.get(this.campoFormulario +'_descripcion').setValue(this.arrayMostrado[item].descripcion);
      this.parentForm.get(this.campoFormulario).setValue (this.arrayMostrado[item].codigo);    
      this.parentForm.get(this.campoFormulario).setValidators([(formGroup:FormGroup)=> null]);
      this.parentForm.get(this.campoFormulario).updateValueAndValidity();
      this.valorSeleccionado.emit(this.arrayMostrado[item]);
      this.arrayMostrado = [];
      this.cargando = false;
      this.valorCorrecto = false;
    }
  }

  keyUp(e:KeyboardEvent){
    
    let actualCursor:HTMLElement= this.el.nativeElement.querySelector(
      ".tt-cursor"
    );  
    
    setTimeout(() => {
      let a=1;
    }, 500);
        
    const x = window.scrollX;
    const y = window.scrollY;
    
    switch (e.key) {
      case "ArrowDown":
        this.sacoFocoMouse(this.itemMouseOver);
        if (this.itemMouseOver < this.arrayMostrado.length-1) {
          this.itemMouseOver = this.itemMouseOver + 1  
        }
        this.pongoFocoMouse(this.itemMouseOver)  
        
        if (actualCursor!=null) {
          actualCursor.scrollIntoView(true);
          window.scrollTo(x,y);  
        }
          
      
        break;
      case "ArrowUp":
        this.sacoFocoMouse(this.itemMouseOver);
        if (this.itemMouseOver > 0) {
          this.itemMouseOver = this.itemMouseOver - 1  
        }
        this.pongoFocoMouse(this.itemMouseOver)

        if (actualCursor!=null) {
          actualCursor.scrollIntoView(false);
          window.scrollTo(x,y);  
        }
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
    this.arrayMostrado = [];
    if (this.terminoInput=="") {
      this.parentForm.get(this.campoFormulario+'_descripcion').setValue('');
    }
  }
  private pongoFocoMouse(item:number){
    if (this.arrayMostrado.length>0) {
      this.arrayMostrado[item].mouseOver = true
    }
  }

  private sacoFocoMouse(item:number){   
    if (this.arrayMostrado.length>0) {
      this.arrayMostrado[item].mouseOver = false  
    }
    
  }

  private hasRequiredField(abstractControl: AbstractControl): boolean {
    if (abstractControl.validator) {
        const validator = abstractControl.validator({}as AbstractControl);
        if (validator && validator.required) {
            return true;
        }
    }
    if (abstractControl['controls']) {
        for (const controlName in abstractControl['controls']) {
            if (abstractControl['controls'][controlName]) {
                if (this.hasRequiredField(abstractControl['controls'][controlName])) {
                    return true;
                }
            }
        }
    }
    return false;
  };

  recuperoValores(){
    this.cargando =true;      
    
            
    this._typeheadService.GetValues(this.resource, this.terminoInput==null?"":this.terminoInput.toUpperCase(), this.keyParameterValue, this.optionalParameters)
                            .subscribe(
                                (resp:any[]) => 
                                  {                  
   
                                    this.arrayMostrado = [];
                                    resp.forEach(element => {
                                      this.arrayMostrado.push({
                                        codigo:element.id,
                                        descripcion: element.descripcion,
                                        mouseOver: false
                                      })
                                    });
                                    this.itemMouseOver = 0;
                                    this.cargando = false;
                                  }
      
                                 ); 
  }

}

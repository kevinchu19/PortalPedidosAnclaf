
//TODO: Implementar unsubscribe 
import { Component, OnInit, Output,EventEmitter, Input, OnDestroy } from '@angular/core';
import { typeheadArray } from '../models/typeheadArray.model';
import { TypeheadService } from '../service/typehead.service';
import { FormGroup } from '@angular/forms';


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
  public description: string = "";

  constructor( private _typeheadService: TypeheadService) { }

  ngOnInit(): void {
    console.log(this.parentForm);
    
    this.parentForm.get(this.campoFormulario).valueChanges.subscribe(selectedValue=>{
      this.terminoInput = this.parentForm.get(this.campoFormulario).value 
      console.log(this.terminoInput);
      
      if (this.terminoInput != '') {
      
        this._typeheadService.GetValues(this.resource, this.terminoInput.toUpperCase(), this.keyParameterValue)
                      .subscribe((resp:any[]) => 
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
                                  }
      
                                 ); 
    
      }
    
      
    })
  }

  

  seleccionaValor(){    
    let item = this.itemMouseOver;
    this.parentForm.get(this.campoFormulario).setValue (this.arrayMostrado[item].codigo);
    this.valorSeleccionado.emit(this.arrayMostrado[item]);
    this.description = this.arrayMostrado[item].descripcion;
    this.arrayMostrado = [];
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
    this.arrayMostrado[item].mouseOver = true
  }

  private sacoFocoMouse(item:number){   
    this.arrayMostrado[item].mouseOver = false
  }

  
}


//TODO: Implementar unsubscribe | Ver forma de scrollear lista con teclado
import { Component, OnInit, Output,EventEmitter, Input, OnDestroy } from '@angular/core';
import { typeheadArray } from '../models/typeheadArray.model';
import { element } from 'protractor';
import { TypeheadService } from '../service/typehead.service';
import { map } from 'rxjs/operators';
import { product } from 'src/app/pages/models/product.model';


@Component({
  selector: 'app-typehead',
  templateUrl: './typehead.component.html',
  styleUrls: ['./typehead.component.css']
})
export class TypeheadComponent implements OnInit {
  
  @Input() keyParameterValue:string;
  @Input() resource:string;
  @Output() valorSeleccionado: EventEmitter<typeheadArray> = new EventEmitter();
  
  
  public terminoInput:string = "";
  public arrayOriginal: typeheadArray[] = [];
  public arrayMostrado: typeheadArray[] = []
  public itemMouseOver: number = 0

  constructor( private _typeheadService: TypeheadService) { }

  ngOnInit(): void {
  }

  filtroArray(){


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
                           
    
  }

  seleccionaValor(item:number){
        
    this.terminoInput = this.arrayMostrado[item].codigo;
    this.valorSeleccionado.emit(this.arrayMostrado[item]);
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
          this.seleccionaValor(this.itemMouseOver);
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

import { Component, OnInit } from '@angular/core';
import { typeheadArray } from '../models/typeheadArray.model';
import { element } from 'protractor';


@Component({
  selector: 'app-typehead',
  templateUrl: './typehead.component.html',
  styleUrls: ['./typehead.component.css']
})
export class TypeheadComponent implements OnInit {
  public terminoInput:string = "";
  public arrayOriginal: typeheadArray[] = [{
    codigo: "0001",
    descripcion: "Enduido x 10 litros",
    mouseOver: false
  },
  {
    codigo: "0002",
    descripcion: "Pintura de interior x 10 litros",
    mouseOver: false
  },
  {
    codigo: "0003",
    descripcion: "Pintura de exterior x 10 litros",
    mouseOver: false
  },
  {
    codigo: "0004",
    descripcion: "Guantes x 6",
    mouseOver: false
  }
];
  public arrayMostrado: typeheadArray[] = []
  public itemMouseOver: number = 0

  constructor() { }

  ngOnInit(): void {
  }

  filtroArray(){
    this.arrayMostrado = this.arrayOriginal;
    this.arrayMostrado = this.arrayOriginal.filter((a)=> a.descripcion.toUpperCase().includes(this.terminoInput.toUpperCase()))
  }

  seleccionaValor(item:number){
    console.log(item);
    
    this.terminoInput = this.arrayMostrado[item].descripcion;
    this.arrayMostrado = [];
  }

  keyUp(e:Event){
    
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

  private pongoFocoMouse(item:number){
    console.log(item);
    
    this.arrayMostrado[item].mouseOver = true
  }

  private sacoFocoMouse(item:number){
    console.log(item);
    
    this.arrayMostrado[item].mouseOver = false
  }
}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nuevopedido',
  templateUrl: './nuevopedido.component.html'
})
export class NuevopedidoComponent implements OnInit {

  currentStep:number = 1;

  constructor() { }

  ngOnInit(): void {
  }
  
  siguientePaso(valor:number){
    this.currentStep = this.currentStep + valor;
  }
}

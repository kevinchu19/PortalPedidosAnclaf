import { Component, OnInit } from '@angular/core';
declare function customInitFunctions();

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {

  hostName:string = window.location.hostname;
  constructor() { }

  ngOnInit(): void {
    customInitFunctions();
  }

  

}

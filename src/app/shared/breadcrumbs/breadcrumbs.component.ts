import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnDestroy  {
  
  public subs$: Subscription;
  public titulo: string;
  
  constructor(private router:Router) { 
    this.subs$ = this.getTituloFromData().subscribe(event => {
                                                    this.titulo = event;     
                                                    document.title = `Portal Pedidos - ${event}`;
                                                  });
  }
  
  ngOnDestroy(): void {
    this.subs$.unsubscribe();
  }
  
  getTituloFromData(){
    
    return this.router.events
      .pipe(
        filter(event => event instanceof ActivationEnd),
        filter((event: ActivationEnd) => event.snapshot.firstChild === null),
        map((event:ActivationEnd) => event.snapshot.data.titulo)
      )
      
  }
  
}

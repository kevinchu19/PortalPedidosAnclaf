import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  menuItems: any[];
  constructor( private sidebarService: SidebarService, private router: Router) {
    this.menuItems = sidebarService.menu;    
   }

  ngOnInit(): void {
  }
  
  navigate(url:string, newWindow:boolean){
    if (url!="") {
      if (newWindow) {
        //window.open(url, "_blank");
        document.location.href = url;
      }else{
        this.router.navigateByUrl(url)
      }
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  constructor(private _authService: AuthService, private router:Router) { }

  ngOnInit(): void {
  }

  logout(){
    this._authService.logOut();
    this.router.navigateByUrl('/login');
  }

  decodeTokenFromStorage():any {
    return this._authService.decodeTokenFromStorage();
   }  

}

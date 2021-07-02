import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'  ]
})
export class LoginComponent implements OnInit {
  
  hostName:string = window.location.hostname;
  public loginFormSubmitted:boolean = false;
  public loginForm = this.fb.group({
    id: ['', Validators.required],
    password: ['', Validators.required]
  });
  
  constructor(private fb:FormBuilder, 
              private _authService: AuthService,
              private router: Router) {  console.log(window);}

  ngOnInit(): void {
    
  }

  inicioLogin(){
    this.loginFormSubmitted = true;
    if (this.loginForm.valid) {
      this._authService.GetUsuario(this.loginForm.value).subscribe(
        (resp) => {
          this.router.navigateByUrl('/home/nuevo-pedido');
        },(err) =>{
          localStorage.removeItem('vendedor');
          localStorage.removeItem('cliente');
          localStorage.removeItem('token');

          Swal.fire({
            title: err.error.mensaje,
            text: 'Ingrese nuevas credenciales por favor',
            icon: 'error',
            confirmButtonText: 'OK'
          })
        }
      )
    }
    
  }

  campoNoValido(_formGroup:FormGroup,campo:string, submittedState:boolean){
    if (_formGroup.get(campo).invalid && submittedState) {
      return true;
    }else
    {
      return false;
    }
  }
}

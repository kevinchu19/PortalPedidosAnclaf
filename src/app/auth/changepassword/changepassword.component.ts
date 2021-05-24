import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {

  public formSubmitted:boolean;

  public changePasswordForm = this.fb.group({
    password: ['', Validators.required],
    NewPassword:['', Validators.required],
    NewPassword2: ['', Validators.required]
  },{
    validators: [this.passwordsIguales()]
  });

  constructor(private fb: FormBuilder, private router:Router, private _authService:AuthService ) { }

  ngOnInit(): void {
  }

  modificarPassword(){
    this.formSubmitted=true;
    if (this.changePasswordForm.valid) {
     
      this._authService.ChangePassword(this.changePasswordForm.value).subscribe(
        (resp:any) =>{
          Swal.fire({
            title: 'Contraseña Modificada',
            text: `Se ha modificado exitosamente la contraseña de su usuario. Muchas gracias.`,
            icon: 'success',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigateByUrl('/home/nuevo-pedido')
            } 
          })
  
  
      },err=>{
        Swal.fire({
          title: 'Error',
          text: err.error.mensaje,
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }) 
    }
  }
  volverHome(){
    this.router.navigateByUrl('/home/nuevo-pedido');
  }
  passwordsIguales(){
  
    return (formGroup:FormGroup) =>{
      const password = formGroup.get("NewPassword");
      const password2 = formGroup.get("NewPassword2");
      
      if (password2.value != "") {
        if (password.value === password2.value) {
          password2.setErrors(null);
        }else{
          password2.setErrors({passwordsDistintas:true})
        }        
      }

    }
  }

  campoNoValido(_formControl:AbstractControl){
    if (_formControl.invalid && this.formSubmitted) {
      return true;
    }else
    {
      return false;
    }
  }
}

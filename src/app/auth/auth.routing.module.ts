import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { AuthGuard } from '../guards/auth.guard';


const routes: Routes = [
    
    {path: 'login', component:LoginComponent},
    {path: 'register', component:RegisterComponent},  
    {path: 'changepassword', component:ChangepasswordComponent, canActivate:[AuthGuard]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule {}

import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes} from '@angular/router';
import { NopagefoundComponent } from './404/nopagefound/nopagefound.component';

//Modulos
import { PagesRoutingModule } from './pages/pages.routing';
import { AuthRoutingModule } from './auth/auth.routing.module';
import { InternalerrorComponent } from './500/internalerror/internalerror.component';

const routes: Routes = [

  //path: '/dashboard' --> PagesRoutingModule
  //path: '/login' --> AuthRoutingModule
  {path: 'internalerror',component: InternalerrorComponent},
  {path: '',redirectTo: '/login', pathMatch:'full'},
  {path: '**',component: NopagefoundComponent}
  
  
]


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
}),
    PagesRoutingModule,
    AuthRoutingModule],
  exports:[RouterModule]
})
export class AppRoutingModule { }

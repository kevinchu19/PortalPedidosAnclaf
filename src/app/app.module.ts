import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//Modulos
import { AppRoutingModule } from './app-routing.module';
import { PagesModule } from './pages/pages.module';
import { AuthModule } from './auth/auth.module';

import { AppComponent } from './app.component';
import { NopagefoundComponent } from './404/nopagefound/nopagefound.component';
import { HomeComponent } from './pages/home/home.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './services/interceptor.service';
import { InternalerrorComponent } from './500/internalerror/internalerror.component';

@NgModule({
  declarations: [
    AppComponent,
    NopagefoundComponent,
    HomeComponent,
    InternalerrorComponent
  ],
  imports: [
    PagesModule,
    AuthModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    NoopAnimationsModule
  ],
  providers:[{
    provide: HTTP_INTERCEPTORS,
    useClass: InterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from "@angular/forms";
import { AppComponent } from './app.component';
import { DemoComponent } from './components/demo/demo.component';
import { SecurityService } from './services/security.service';
import { CookieService } from 'ngx-cookie-service';
import { PersistenceModule } from 'angular-persistence';

@NgModule({
  declarations: [
    AppComponent,
    DemoComponent
  ],
  imports: [
    BrowserModule,
    PersistenceModule,
    FormsModule
  ],

  providers: [CookieService, SecurityService],
  bootstrap: [AppComponent]
})
export class AppModule { }

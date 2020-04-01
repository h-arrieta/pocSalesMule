import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http'

import { CardComponent } from './pages/card/card.component';
import { DetailsComponent } from './pages/details/details.component';
import { LoginComponent } from './pages/login/login.component';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { SharedService } from './services/shared.service';
import { DataService } from './services/data.service';


// the second parameter 'fr-FR' is optional
registerLocaleData(localeEs, 'es-ES');


@NgModule({
  declarations: [AppComponent, CardComponent, DetailsComponent, LoginComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [
    StatusBar,
    SplashScreen,
    SharedService,
    DataService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

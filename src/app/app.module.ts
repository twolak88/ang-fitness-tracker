import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WelcomeComponent } from './welcome/welcome.component';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AuthModule } from './auth/auth.module';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    HeaderComponent,
    SidenavListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AuthModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

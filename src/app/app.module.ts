import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './views/home/welcome/welcome.component';
import { EditorComponent } from './views/home/editor/editor.component';
import { PlayerComponent } from './views/home/player/player.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    EditorComponent,
    PlayerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

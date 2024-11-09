import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './views/home/welcome/welcome.component';
import { EditorComponent } from './views/home/editor/editor.component';
import { PlayerComponent } from './views/home/player/player.component';
import { BaseLayerComponent } from './shared/layers/base-layer/base-layer.component';
import { PanelNavButtonComponent } from './shared/partial/panel-nav-button/panel-nav-button.component';
import { PanelNavBarComponent } from './shared/partial/panel-nav-bar/panel-nav-bar.component';
import { EditorImportComponent } from './views/home/editor/editor-import/editor-import.component';
import { EditorExportComponent } from './views/home/editor/editor-export/editor-export.component';
import { EditorActorComponent } from './views/home/editor/editor-actor/editor-actor.component';
import { EditorContentComponent } from './views/home/editor/editor-content/editor-content.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    EditorComponent,
    PlayerComponent,
    BaseLayerComponent,
    PanelNavButtonComponent,
    PanelNavBarComponent,
    EditorImportComponent,
    EditorExportComponent,
    EditorActorComponent,
    EditorContentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

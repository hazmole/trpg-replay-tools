import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

/* Components */
import { WelcomeComponent } from './views/main/welcome/welcome.component';
import { EditorComponent } from './views/main/editor/editor.component';
import { PlayerComponent } from './views/main/player/player.component';
import { BaseLayerComponent } from './views/shared/layers/base-layer/base-layer.component';
import { PanelNavButtonComponent } from './views/shared/partial/panel-nav-button/panel-nav-button.component';
import { PanelNavBarComponent } from './views/shared/partial/panel-nav-bar/panel-nav-bar.component';
import { EditorImportComponent } from './views/main/editor/editor-import/editor-import.component';
import { EditorExportComponent } from './views/main/editor/editor-export/editor-export.component';
import { EditorActorComponent } from './views/main/editor/editor-actor/editor-actor.component';
import { EditorContentComponent } from './views/main/editor/editor-content/editor-content.component';
import { InputTitleComponent } from './views/shared/partial/input-title/input-title.component';
import { InputDropdownSelectComponent } from './views/shared/partial/input-dropdown-select/input-dropdown-select.component';
import { ButtonApplyComponent } from './views/shared/partial/button-apply/button-apply.component';
import { NotifyMessageComponent } from './views/shared/partial/notify-message/notify-message.component'

/* Services */
import { ReplayManagerService } from './services/replay-manager.service';
import { ParserService } from './services/parser.service';
import { ToolService } from './services/tool.service';

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
    InputTitleComponent,
    InputDropdownSelectComponent,
    ButtonApplyComponent,
    NotifyMessageComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    //AppRoutingModule,
  ],
  providers: [
    ReplayManagerService,
    ParserService,
    ToolService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

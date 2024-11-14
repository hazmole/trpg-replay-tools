import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from "@angular/material/dialog";
import { DragDropModule } from '@angular/cdk/drag-drop';

//import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

/* Components */
import { WelcomeComponent } from './views/main/welcome/welcome.component';
import { EditorComponent } from './views/main/editor/editor.component';
import { EditorImportComponent } from './views/main/editor/editor-import/editor-import.component';
import { EditorExportComponent } from './views/main/editor/editor-export/editor-export.component';
import { EditorActorComponent } from './views/main/editor/editor-actor/editor-actor.component';
import { EditorActorDeleteComponent } from './views/main/editor/editor-actor/editor-actor-delete/editor-actor-delete.component';
import { EditorScriptComponent } from './views/main/editor/editor-script/editor-script.component';
import { AddItemSelectComponent } from './views/main/editor/editor-script/add-item-select/add-item-select.component';
import { AddEditTitleComponent } from './views/main/editor/editor-script/add-edit-title/add-edit-title.component';
import { AddEditTalkComponent } from './views/main/editor/editor-script/add-edit-talk/add-edit-talk.component';
import { AddEditImageComponent } from './views/main/editor/editor-script/add-edit-image/add-edit-image.component';
import { PlayerComponent } from './views/main/player/player.component';

import { BaseLayerComponent } from './views/shared/layers/base-layer/base-layer.component';
import { TabLayerComponent } from './views/shared/layers/tab-layer/tab-layer.component';
import { PanelNavButtonComponent } from './views/shared/partial/panel-nav-button/panel-nav-button.component';
import { PanelNavBarComponent } from './views/shared/partial/panel-nav-bar/panel-nav-bar.component';
import { InputTitleComponent } from './views/shared/partial/input-title/input-title.component';
import { InputDropdownSelectComponent } from './views/shared/partial/input-dropdown-select/input-dropdown-select.component';
import { ButtonApplyComponent } from './views/shared/partial/button-apply/button-apply.component';
import { IconButtonComponent } from './views/shared/partial/icon-button/icon-button.component'
import { NotifyMessageComponent } from './views/shared/partial/notify-message/notify-message.component'
import { PopupDialogComponent } from './views/shared/partial/popup-dialog/popup-dialog.component';

import { DialogHeaderComponent } from './views/shared/dialog/dialog-header/dialog-header.component';
import { DialogFooterComponent } from './views/shared/dialog/dialog-footer/dialog-footer.component';
import { DialogBodyComponent } from './views/shared/dialog/dialog-body/dialog-body.component';
import { ButtonListComponent } from './views/shared/partial/button-list/button-list.component';
import { ColorPickerComponent } from './views/shared/inputs/color-picker/color-picker.component';

/* Services */
import { ReplayManagerService } from './services/replay-manager.service';
import { StorageManagerService } from './services/storage-manager.service';
import { ParserService } from './services/parser.service';
import { ToolService } from './services/tool.service';
import { LanguageService } from './services/language.service';


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
    EditorActorDeleteComponent,
    EditorScriptComponent,
    AddItemSelectComponent,
    AddEditTitleComponent,
    AddEditTalkComponent,
    AddEditImageComponent,
    InputTitleComponent,
    InputDropdownSelectComponent,
    ButtonApplyComponent,
    IconButtonComponent,
    NotifyMessageComponent,
    TabLayerComponent,
    PopupDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    DragDropModule,

    DialogHeaderComponent,
    DialogFooterComponent,
    DialogBodyComponent,
    ButtonListComponent,
    ColorPickerComponent,
  ],
  providers: [
    ReplayManagerService,
    StorageManagerService,
    ParserService,
    ToolService,
    LanguageService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

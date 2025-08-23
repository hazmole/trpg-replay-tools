import { Component, Input } from '@angular/core';
import { TabControl } from 'src/app/interfaces/tab-control.interface';

import { ReplayManagerService } from 'src/app/services/replay-manager.service';
import { ToolService } from 'src/app/services/tool.service';
import { EditorImportInheritComponent, ImportInheritReturn } from './editor-import-inherit/editor-import-inherit.component';
import { InheritParams } from 'src/app/classes/replay-config';

@Component({
  selector: 'app-editor-import',
  templateUrl: './editor-import.component.html',
  styleUrls: ['./editor-import.component.css']
})
export class EditorImportComponent {
  @Input({ required: true }) control!:TabControl;

  constructor(
    private rpManager: ReplayManagerService,
    private tool: ToolService,
  ){ }


  private tempFile: (File | null) = null;


  onFileSelected(event:any): void {
    this.tempFile = event.target.files[0];
  }

  public ImportFile() {
    if(!this.tempFile) {
      this.tool.PopupErrorNotify("尚未選擇匯入來源！");
      return ;
    }

    if(this.rpManager.isReplayLoaded()){
      this.tool.PopupDialog(EditorImportInheritComponent, {}, (retObj:ImportInheritReturn|null) => {
        if( retObj!=null ) {
          this._importFile({
            isInheritActor: retObj.isInheritActor,
            isInheritTheme: retObj.isInheritTheme,
          });
        }
      });
    } else {
      this._importFile({
        isInheritActor: false,
        isInheritTheme: false,
      });
    }
  }

  private _importFile(optoins: InheritParams) {
    let file = <File> this.tempFile;
    this.rpManager.Import(file, optoins)
      .then(() => {
        this.tool.PopupSuccessfulNotify("讀取成功！");
      })
      .then(() => {
        this.rpManager.Save();
      })
      .then(() => {
        this.control.Goto("config");
      })
      .catch((err) => {
        console.error(err);
      });

  }

  public Clear() {
    this.rpManager.Clear();
    this.tool.PopupSuccessfulNotify("清除成功！");
  }
}

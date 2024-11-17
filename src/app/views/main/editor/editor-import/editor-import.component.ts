import { Component, Input } from '@angular/core';
import { TabControl } from 'src/app/interfaces/tab-control.interface';

import { ReplayManagerService, ImportOptions } from 'src/app/services/replay-manager.service';
import { StorageManagerService } from 'src/app/services/storage-manager.service';
import { ToolService } from 'src/app/services/tool.service';
import { EditorImportInheritComponent, ImportInheritReturn } from './editor-import-inherit/editor-import-inherit.component';

@Component({
  selector: 'app-editor-import',
  templateUrl: './editor-import.component.html',
  styleUrls: ['./editor-import.component.css']
})
export class EditorImportComponent {
  @Input({ required: true }) control!:TabControl;

  constructor(
    private rpManager: ReplayManagerService,
    private storage: StorageManagerService,
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

    if(this.isActorExisted()){
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

  private _importFile(optoins: ImportOptions) {
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

  private isActorExisted(): boolean {
    const actorList = this.rpManager.GetActorList();
    return Object.keys(actorList).length > 0;
  }

  public Clear() {
    this.rpManager.Clear();
    this.tool.PopupSuccessfulNotify("清除成功！");
  }
}

import { Component } from '@angular/core';

import { ReplayManagerService } from 'src/app/services/replay-manager.service';
import { StorageManagerService } from 'src/app/services/storage-manager.service';
import { ToolService } from 'src/app/services/tool.service';

@Component({
  selector: 'app-editor-import',
  templateUrl: './editor-import.component.html',
  styleUrls: ['./editor-import.component.css']
})
export class EditorImportComponent {

  constructor(
    private rpManager: ReplayManagerService,
    private storage: StorageManagerService,
    private tool: ToolService,
  ){ }


  private tempFile: (File | null) = null;


  onFileSelected(event:any): void {
    this.tempFile = event.target.files[0];
  }

  public importFile() {
    if(this.tempFile) {
      this.rpManager.Import(this.tempFile)
        .then(() => {
          this.rpManager.Test();
          this.tool.PopupNotifyMsg("success", "讀取成功！");
        })
        .then(() => {
          this.storage.Save();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }
}

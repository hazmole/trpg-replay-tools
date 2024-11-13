import { Component, Input } from '@angular/core';

import { ReplayManagerService } from 'src/app/services/replay-manager.service';
import { StorageManagerService } from 'src/app/services/storage-manager.service';
import { ToolService } from 'src/app/services/tool.service';

@Component({
  selector: 'app-editor-import',
  templateUrl: './editor-import.component.html',
  styleUrls: ['./editor-import.component.css']
})
export class EditorImportComponent {
  @Input() control:any = null;

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
    if(this.tempFile) {
      this.rpManager.Import(this.tempFile)
        .then(() => {
          this.tool.PopupSuccessfulNotify("讀取成功！");
        })
        .then(() => {
          this.rpManager.Save();
        })
        .then(() => {
          this.control.goto("actors");
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      this.tool.PopupErrorNotify("尚未選擇匯入來源！");
    }
  }

  public Clear() {
    this.rpManager.Clear();
    this.tool.PopupSuccessfulNotify("清除成功！");
  }
}

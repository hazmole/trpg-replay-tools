import { Injectable } from '@angular/core';
import { ReplayManagerService } from 'src/app/services/replay-manager.service';
import { ToolService } from 'src/app/services/tool.service';

const storageKey: string = 'hazRpInfo_v2';

@Injectable({
  providedIn: 'root'
})
export class StorageManagerService {

  constructor(
    private rpManager: ReplayManagerService,
    private tool: ToolService,
  ) { }




  Load(): void {
    try {
      let info = localStorage.getItem(storageKey) || "";
      this.rpManager.SetInfoFromJSON(JSON.parse(info));
      this.tool.PopupSuccessfulNotify("自動讀取成功！");
    } catch(e) {
      this.tool.PopupErrorNotify("自動讀取失敗！");
      console.error(e);
    }

  }

  Save(): void {
    try {
      let infoObj = this.rpManager.GetInfoJSON();
      localStorage.setItem(storageKey, JSON.stringify(infoObj));
    } catch(e) {
      this.tool.PopupErrorNotify("自動儲存失敗！");
      console.error(e);
    }
  }



}

import { Injectable } from '@angular/core';
import { ReplayManagerService } from 'src/app/services/replay-manager.service';
import { ToolService } from 'src/app/services/tool.service';
import { ReplayInfo } from '../interfaces/replay-info.interface';

const storageKey: string = 'hazRpInfo_v2';

@Injectable({
  providedIn: 'root'
})
export class StorageManagerService {

  constructor(
    private tool: ToolService,
  ) { }




  Load(): (ReplayInfo | null) {
    try {
      let item = localStorage.getItem(storageKey) || "";
      if(item === "") return null;
      
      let infoObj = JSON.parse(item);
      this.tool.PopupSuccessfulNotify("自動讀取成功！");
      return infoObj;
    } catch(e) {
      this.tool.PopupErrorNotify("自動讀取失敗！");
      console.error(e);
    }
    return null;
  }

  Save(infoObj: ReplayInfo): void {
    try {
      localStorage.setItem(storageKey, JSON.stringify(infoObj));
    } catch(e) {
      this.tool.PopupErrorNotify("自動儲存失敗！");
      console.error(e);
    }
  }



}

import { Component, OnInit } from '@angular/core';
import {CdkDragDrop} from '@angular/cdk/drag-drop';

import { ReplayManagerService } from 'src/app/services/replay-manager.service';
import { ToolService } from 'src/app/services/tool.service';

import { AddEditTitleComponent } from './add-edit-title/add-edit-title.component';
import { AddEditTalkComponent } from './add-edit-talk/add-edit-talk.component';
import { AddEditImageComponent } from './add-edit-image/add-edit-image.component';

import { ScriptEntry, ActorInfo, ScriptEntryType } from 'src/app/interfaces/replay-info.interface';
import { Mode, AddEditScriptParam, AddEditScriptReturn } from 'src/app/interfaces/add-edit-script-entry.interface';
import { AddItemSelectComponent } from './add-item-select/add-item-select.component';

@Component({
  selector: 'app-editor-script',
  templateUrl: './editor-script.component.html',
  styleUrls: ['./editor-script.component.css']
})
export class EditorScriptComponent implements OnInit {

  constructor(
    private rpManager: ReplayManagerService,
    private tool: ToolService,
  ){ }

  public entryList: Array<ScriptEntry> = [];

  ngOnInit(): void {
    this.initList();
  }

  initList(): void {
    this.entryList = Object.values(this.rpManager.GetScriptEntryList());
  }


  getEntryClass(entry:ScriptEntry): string {
    switch(entry.type) {
      case "talk":
        return `talk ${entry.channel}`;
      default:
        return "special";
    }
  }
  getEntryTitle(entry:ScriptEntry): string {
    switch(entry.type) {
      case "talk":
        let actorInfo = this.getActor(entry);
        let channel = (entry.channel === "main"? "": "[場外] ");
        return `${channel}${actorInfo.name}`;
      case "halt":
        return "分段符號";
      case "title":
        return `段落標題：${ entry.content }`;
      case "setBg":
        return `顯示背景圖片`;
    }
  }
  getEntryTitleStyle(entry:ScriptEntry): Object {
    switch(entry.type) {
      case "talk":
        let actorInfo = this.getActor(entry);
        return { color: actorInfo.color };
      default:
        return {};
    }
  }
  isShowEdit(entry:ScriptEntry): boolean {
    switch(entry.type) {
      case "talk":
      case "title":
      case "setBg":
        return true;
      default:
        return false;
    }
  }


  getActor(entry: ScriptEntry): (ActorInfo) {
    const actorList = this.rpManager.GetActorList();
    if(entry.actorId != null) {
      return actorList[entry.actorId];
    }
    return { name: "", color: "#888888", id:-1, imgUrl: "" };
  }

  isTalkEntry(entry: ScriptEntry): boolean {
    return entry.type === "talk";
  }
  isTitleEntry(entry: ScriptEntry): boolean {
    return entry.type === "title";
  }
  isHaltEntry(entry: ScriptEntry): boolean {
    return entry.type === "halt";
  }
  isBgImgEntry(entry: ScriptEntry): boolean {
    return entry.type === "setBg";
  }


  //=================
  OnDrop(event:CdkDragDrop<any, any, any>): void {
    let prevIdx = (event.previousIndex);
    let currIdx = (event.currentIndex);

    // Remove
    const elem = this.entryList.splice(prevIdx, 1)[0];
    // Append
    this.entryList.splice(currIdx, 0, elem);
  }

  AddEntry(idx:number): void {
    this.tool.PopupDialog(AddItemSelectComponent, {}, (type:ScriptEntryType) => {
      // Handle "halt" type
      if(type === "halt") {
        let entry:ScriptEntry = { type, content:"" };
        this.entryList.splice((idx+1), 0, entry);
        return ;
      }
      
      
      const param: AddEditScriptParam = { mode: "add" };
      let comp:any = this._getCompByType(type);
      if(comp == null) {
        this.tool.PopupErrorNotify("錯誤：未知的段落類型！");
      } else {
        this.tool.PopupDialog(comp, param, (retObj:AddEditScriptReturn) => {
          if(retObj.entry) {
            this.entryList.splice((idx+1), 0, retObj.entry);
          }
        });
      }
    });
  }
  EditEntry(entry:ScriptEntry, idx:number): void {
    const param: AddEditScriptParam = { mode: "edit", entry:entry };
    let comp:any = this._getCompByType(entry.type);

    if(comp == null) {
      this.tool.PopupErrorNotify("錯誤：未知的段落類型！");
    } else {
      this.tool.PopupDialog(comp, param, (retObj:AddEditScriptReturn) => {
        if(retObj.entry) {
          this.entryList[idx] = retObj.entry;
        }
      });
    }
  }

  private _getCompByType(type: ScriptEntryType): any {
    switch(type) {
      case "title": return AddEditTitleComponent;
      case "talk":  return AddEditTalkComponent;
      case "setBg": return AddEditImageComponent;
    }
    return null;
  }

  DeleteEntry(_entry:ScriptEntry, idx:number): void {
    this.entryList.splice(idx, 1);
    /*let entryName = "";
    switch(entry.type) {
      case "talk": entryName = "這段對話"; break;
      case "halt": entryName = "這個分段符號"; break;
      case "setBg": entryName = "這張背景圖片"; break;
      case "title": entryName = "這個段落標題"; break;
    }
    
    this.tool.PopupMsgDialog("刪除段落", `你確定要刪除${entryName}嗎？`, () => {
      this.entryList.splice(idx, 1);
    });
    */
  }

}

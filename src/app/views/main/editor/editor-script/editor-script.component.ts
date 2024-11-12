import { Component, OnInit } from '@angular/core';
import {CdkDragDrop} from '@angular/cdk/drag-drop';

import { ReplayManagerService } from 'src/app/services/replay-manager.service';
import { ToolService } from 'src/app/services/tool.service';

import { ScriptEntry, ActorInfo } from 'src/app/interfaces/replay-info.interface';

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
        let channel = (entry.channel === "main"? "": "[場外]");
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
  isShowEntryContent(entry:ScriptEntry): boolean {
    switch(entry.type) {
      case "talk":
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

  EditEntry(entry:ScriptEntry): void {
    console.log(entry);
    this.tool.PopupSuccessfulNotify("Edit!");
  }
  DeleteEntry(entry:ScriptEntry): void {
    console.log(entry);
    this.tool.PopupSuccessfulNotify("Delete!");
  }
}

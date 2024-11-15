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
import { ActionParamMove, ActionParamAdd, ActionParamEdit, ActionParamDel, ScriptAction } from 'src/app/interfaces/script-action.interface';

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
  public undoStack: Array<ScriptAction> = [];
  public redoStack: Array<ScriptAction> = [];

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


  Save(): void {
    this.rpManager.SetScriptEntryList(this.entryList);
    this.tool.PopupSuccessfulNotify("儲存成功！");
  }

  //=================
  OnDrop(event:CdkDragDrop<any, any, any>): void {
    let prevIdx = (event.previousIndex);
    let nextIdx = (event.currentIndex);

    // Move
    this._moveEntry(prevIdx, nextIdx);
    // Record
    
  }

  AddEntry(idx:number): void {
    this.tool.PopupDialog(AddItemSelectComponent, {}, (type:ScriptEntryType) => {
      // Handle "halt" type
      if(type === "halt") {
        let entry:ScriptEntry = { type, content:"" };
        this._addEntry(idx+1, entry);
        return ;
      }
      // Handle others
      let comp:any = this._getCompByType(type);
      if(comp == null) {
        this.tool.PopupErrorNotify("錯誤：未知的段落類型！");
      } else {
        this.tool.PopupDialog(comp, { mode: "add" }, (retObj:AddEditScriptReturn) => {
          if(retObj.entry) {
            this._addEntry(idx+1, retObj.entry);
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
          this._editEntry(idx, retObj.entry);
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

  DeleteEntry(entry:ScriptEntry, idx:number): void {
    this._deleteEntry(idx, entry);
  }


  private _moveEntry(fromIdx:number, toIdx:number, recordMode?:number): void {
    // Execute
    const elem = this.entryList.splice(fromIdx, 1)[0];
    this.entryList.splice(toIdx, 0, elem);
    // Record
    this.appendScriptAction({ type: "move", param: { toIdx, fromIdx } }, recordMode);
  }
  private _addEntry(idx:number, newEntry:ScriptEntry, recordMode?:number) {
    // Execute
    this.entryList.splice(idx, 0, newEntry);
    // Record
    this.appendScriptAction({ type: "add", param: { idx, newEntry } }, recordMode);
  }
  private _editEntry(idx:number, newEntry:ScriptEntry, recordMode?:number) {
    // Execute
    let originEntry = Object.assign({}, this.entryList[idx]);
    this.entryList[idx] = newEntry;
    // Record
    this.appendScriptAction({ type: "edit", param: { idx, originEntry, newEntry } }, recordMode);
  }
  private _deleteEntry(idx:number, originEntry:ScriptEntry, recordMode?:number) {
    // Execute
    this.entryList.splice(idx, 1);
    // Record
    this.appendScriptAction({ type: "delete", param: { idx, originEntry } }, recordMode);
  }

  //========================
  // Undo/Redo function
  //========================
  private STACK_MAX_SIZE = 10;

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }
  canRedo(): boolean {
    return this.redoStack.length > 0;
  }
  Undo(): void {
    if(!this.canUndo()) return ;
    
    const action = <ScriptAction> this.undoStack.pop();
    switch(action.type){
      case "move": {
        let param = <ActionParamMove> action.param;
        this._moveEntry(param.toIdx, param.fromIdx, 1);
        break;
      }
      case "add": {
        let param = <ActionParamAdd> action.param;
        this._deleteEntry(param.idx, param.newEntry, 1);
        break;
      }
      case "edit": {
        let param = <ActionParamEdit> action.param;
        this._editEntry(param.idx, param.originEntry, 1);
        break;
      }
      case "delete": {
        let param = <ActionParamDel> action.param;
        this._addEntry(param.idx, param.originEntry, 1);
        break;
      }
      default:
        this.tool.PopupErrorNotify("此功能尚未實裝");
        return ;
    }
  }
  Redo(): void {
    if(!this.canRedo()) return ;

    const action = <ScriptAction> this.redoStack.pop();
    switch(action.type){
      case "move": {
        let param = <ActionParamMove> action.param;
        this._moveEntry(param.fromIdx, param.toIdx, 2);
        break;
      }
      case "add": {
        let param = <ActionParamAdd> action.param;
        this._addEntry(param.idx, param.newEntry, 2);
        break;
      }
      case "edit": {
        let param = <ActionParamEdit> action.param;
        this._editEntry(param.idx, param.newEntry, 2);
        break;
      }
      case "delete": {
        let param = <ActionParamDel> action.param;
        this._deleteEntry(param.idx, param.originEntry, 2);
        break;
      }
      default:
        this.tool.PopupErrorNotify("此功能尚未實裝");
        return ;
    }
  }

  private appendScriptAction(action:ScriptAction, recordMode?:number): void {
    // [recordMode]
    //  0: user action
    //  1: trigger by undo
    //  2: trigger by redo
    
    recordMode = recordMode || 0;
    switch(recordMode) {
      case 0:
        this.undoStack.push(action);
        this.redoStack.length = 0;
        break;
      case 1:
        this.redoStack.push(action);
        break;
      case 2:
        this.undoStack.push(action);
        break;
    }
    
    if(this.undoStack.length > this.STACK_MAX_SIZE){
      this.undoStack.shift();
    }
    if(this.redoStack.length > this.STACK_MAX_SIZE){
      this.redoStack.shift();
    }
  }
}

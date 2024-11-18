import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ReplayManagerService } from 'src/app/services/replay-manager.service';
import { ToolService } from 'src/app/services/tool.service';
import { ActorInfo } from 'src/app/interfaces/replay-info.interface';

import { TwoColumnButtonEntry, TwoColumnClickBehavior } from 'src/app/views/shared/two-column/two-column-frame/two-column-frame.component';
import { EditorActorDeleteComponent, DeleteActorParam, DeleteActorReturn } from './editor-actor-delete/editor-actor-delete.component';

@Component({
  selector: 'app-editor-actor',
  templateUrl: './editor-actor.component.html',
  styleUrls: ['./editor-actor.component.css']
})
export class EditorActorComponent implements OnInit {

  constructor(
    private rpManager: ReplayManagerService,
    private tool: ToolService,
  ){ }

  public formGroup = new FormGroup({
    actorName: new FormControl<string>(''),
    color:  new FormControl<string>(''),
    imgUrl: new FormControl<string>(''),
  });

  // Two-Colume Selection Frame
  public itemList: Array<TwoColumnButtonEntry> = [];
  public itemBehavior: TwoColumnClickBehavior;
  public itemSelecteID: number = -1;

  private actorMap: Record<number, ActorInfo> = {};
  public errImgFlag: boolean = false;
  public outputList = {
    actorID: -1,
    scriptOwnCount: 0,
  };

  

  ngOnInit(): void {
    this.itemBehavior = {
      add: () => { this.Add() },
      select: () => { this.Select() },
    };
    this.initList();
  }
  
  initList(): void {
    this.actorMap = this.rpManager.GetActorList();
    this.itemList = Object.values(this.actorMap).map(this.parseItem);
  }


  Save(): void {
    const newValues = { 
      name:   <string> this.formGroup.controls.actorName.value,
      color:  <string> this.formGroup.controls.color.value,
      imgUrl: <string> this.formGroup.controls.imgUrl.value,
    };
    this.rpManager.SetActorInfo(this.itemSelecteID, newValues);
    this.initList();
    this.tool.PopupSuccessfulNotify("儲存成功！");
  }
  Select(): void {
    if(this.itemSelecteID !== -1) {
      // update values
      let actor = this.actorMap[this.itemSelecteID];
      this.formGroup.controls.actorName.setValue(actor.name);
      this.formGroup.controls.color.setValue(actor.color);
      this.formGroup.controls.imgUrl.setValue(actor.imgUrl);
      this.errImgFlag = false;

      this.outputList.actorID = actor.id;
      this.outputList.scriptOwnCount = Object.values(this.rpManager.GetScriptEntryList()).filter((script)=>{
        return (script.actorId != null) && script.actorId == actor.id;
      }).length;
    }
  }
  Add(): void {
    let maxId = -1;
    Object.values(this.actorMap).forEach(actor => {
      if(maxId < actor.id) maxId = actor.id;
    });
    const newActor = {
      id: (maxId+1),
      name: "新創角色",
      color: "#888888",
      imgUrl: "",
    };

    this.rpManager.SetActorInfo(newActor.id, newActor);
    this.initList();
  }
  Remove(): void {
    let id = this.itemSelecteID;
    
    if(this.outputList.scriptOwnCount == 0) {
      this.tool.PopupConfirmMsgDialog("刪除角色", "你確定要刪除這個角色嗎？", () => {
        this._removeActor(id);
      });
    } else if(this.itemList.length > 1) {
      const param: DeleteActorParam = { actor_id: id };
      this.tool.PopupDialog(EditorActorDeleteComponent, param, (retObj:DeleteActorReturn) => {
        if(retObj.is_delete_related) {
          this.rpManager.DeleteScriptByActor(retObj.old_actor_id);
        } else {
          this._replaceActorOfScripts(retObj.old_actor_id, retObj.new_actor_id);
          this._removeActor(id);
        }
      });
    } else {
      this.tool.PopupErrorNotify("錯誤：你必須要有至少一個角色！");
    }
  }

  private _replaceActorOfScripts(oldID: number, newID: number): void {
    this.rpManager.GetScriptEntryList().forEach((entry) => {
      if(entry.actorId === oldID)
        entry.actorId = newID;
    })
  }
  private _removeActor(actorID: number): void {
    this.tool.PopupSuccessfulNotify("刪除成功！");
    this.rpManager.DeleteActorInfo(actorID);
    this.itemSelecteID = -1;
    this.initList();
  }


  OnChangeImageUrl(): void {
    this.errImgFlag = false;
  }
  OnImageError(): void {
    this.errImgFlag = true;
  }

  getImgUrl(): string {
    return this.formGroup.controls.imgUrl.value || "";
  }

  parseItem(item:ActorInfo): TwoColumnButtonEntry {
    return { id:item.id, text:item.name };
  }
}

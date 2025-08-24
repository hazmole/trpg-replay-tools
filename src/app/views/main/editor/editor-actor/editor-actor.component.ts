import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ReplayManagerService } from 'src/app/services/replay-manager.service';
import { ToolService } from 'src/app/services/tool.service';

import { TwoColumnButtonEntry, TwoColumnClickBehavior } from 'src/app/views/shared/two-column/two-column-frame/two-column-frame.component';
import { EditorActorDeleteComponent, DeleteActorParam, DeleteActorReturn } from './editor-actor-delete/editor-actor-delete.component';
import { Actor } from 'src/app/classes/actor-collection';

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
  public itemSelecteID: string;

  public errImgFlag: boolean = false;
  public outputList = {
    actorID: "",
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
    const actorColle = this.rpManager.GetActorColle();
    this.itemList = actorColle.GetList().map((actor) => {
      return this.parseItem(actor);
    });
  }


  Save(): void {
    this.rpManager.GetActorColle().Update(this.itemSelecteID, {
      name:   <string> this.formGroup.controls.actorName.value,
      color:  <string> this.formGroup.controls.color.value,
      imgUrl: <string> this.formGroup.controls.imgUrl.value,
    });
    this.initList();
    this.rpManager.Save();
    this.tool.PopupSuccessfulNotify("儲存成功！");
  }
  Select(): void {
    if(this.itemSelecteID !== "") {
      // update values
      const actor = this.rpManager.GetActorColle().GetByID(this.itemSelecteID);
      this.formGroup.controls.actorName.setValue(actor.name);
      this.formGroup.controls.color.setValue(actor.color);
      this.formGroup.controls.imgUrl.setValue(actor.imgUrl);
      this.errImgFlag = false;

      this.outputList.actorID = actor.id;
      this.outputList.scriptOwnCount = this.rpManager.GetScriptArray().filter((script) => {
        return script.actorId === actor.id;
      }).length;
    }
  }
  Add(): void {
    this.rpManager.GetActorColle().Add("", {
      name: "新創角色",
      color: "#888888",
      id: "", imgUrl: "",
    }, true);
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
          this._deleteAllChatOfActor(retObj.old_actor_id);
          this._removeActor(id);
        } else {
          this._replaceActorOfScripts(retObj.old_actor_id, retObj.new_actor_id);
          this._removeActor(id);
        }
      });
    } else {
      this.tool.PopupErrorNotify("錯誤：你必須要有至少一個角色！");
    }
  }

  private _deleteAllChatOfActor(actorID: string): void {
    const newArr = this.rpManager.GetScriptArray().filter((script) => (script.actorId !== actorID));
    this.rpManager.SetScriptArray(newArr);
  }
  private _replaceActorOfScripts(oldID: string, newID: string): void {
    this.rpManager.GetScriptArray().forEach((script) => {
      if(script.actorId === oldID)
        script.actorId = newID;
    });
  }
  private _removeActor(actorID: string): void {
    this.tool.PopupSuccessfulNotify("刪除成功！");
    this.rpManager.GetActorColle().Remove(actorID);
    this.itemSelecteID = "";
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

  parseItem(item: Actor): TwoColumnButtonEntry {
    return { id:item.id, text:item.name };
  }
}

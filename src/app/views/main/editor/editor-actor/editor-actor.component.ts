import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ReplayManagerService } from 'src/app/services/replay-manager.service';
import { ToolService } from 'src/app/services/tool.service';
import { ActorInfo } from 'src/app/interfaces/replay-info.interface';

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

  public currentActorId: number = -1;
  public actorList: Array<ActorInfo> = [];
  
  public errImgFlag: boolean = false;

  public formGroup = new FormGroup({
    actorName: new FormControl<string>(''),
    color:  new FormControl<string>(''),
    imgUrl: new FormControl<string>(''),
  });


  public outputList = {
    actorID: -1,
    scriptOwnCount: 0,
  };

  ngOnInit(): void {
    this.initList();
  }
  
  initList(): void {
    this.actorList = Object.values(this.rpManager.GetActorList());
  }

  isSelected(): boolean {
    return this.currentActorId !== -1;
  }
  getImgUrl(): string {
    return this.formGroup.controls.imgUrl.value || "";
  }

  SelectActor(actor:ActorInfo): void {
    this.currentActorId = (this.currentActorId == actor.id)? -1: actor.id;
    if(this.isSelected()) {
      // update values
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

  ChangeImageUrl(): void {
    this.errImgFlag = false;
  }
  OnImageError(): void {
    this.errImgFlag = true;
  }

  SaveActor(): void {
    let id = this.currentActorId;
    let name = this.formGroup.controls.actorName.value || "";
    let color = this.formGroup.controls.color.value || "#888888";
    let imgUrl = this.formGroup.controls.imgUrl.value || "";
    
    const newValues = {
      name, color, imgUrl
    };
    
    this.rpManager.SetActorInfo(id, newValues);
    this.initList();
    this.tool.PopupSuccessfulNotify("儲存成功！");
  }

  AddActor(): void {
    let maxId = -1;
    this.actorList.forEach(actor => {
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

  RemoveActor(): void {
    let id = this.currentActorId
    
    if(this.outputList.scriptOwnCount == 0) {
      this.removeRedundantActor(id);
    } else if(this.actorList.length > 1) {
      this.removeActiveActor(id);
    } else {
      this.tool.PopupErrorNotify("錯誤：你必須要有至少一個角色！");
    }
  }

  private removeActiveActor(actorID: number): void {
    const param: DeleteActorParam = { actor_id: actorID };

    this.tool.PopupDialog(EditorActorDeleteComponent, param, (retObj:DeleteActorReturn) => {
      // Update Scripts
      this.rpManager.GetScriptEntryList().forEach((entry) => {
        if(entry.actorId === retObj.old_actor_id)
          entry.actorId = retObj.new_actor_id;
      })
      // Remove
      this.rpManager.DeleteActorInfo(actorID);
      this.currentActorId = -1;
      this.initList();
      this.tool.PopupSuccessfulNotify("刪除成功！");
    });
  }

  private removeRedundantActor(actorID: number): void {
    this.tool.PopupMsgDialog("刪除角色", "你確定要刪除這個角色嗎？", () => {
      this.rpManager.DeleteActorInfo(actorID);
      this.currentActorId = -1;
      this.initList();
      this.tool.PopupSuccessfulNotify("刪除成功！");
    });
  }

}

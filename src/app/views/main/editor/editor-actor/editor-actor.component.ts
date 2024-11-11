import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ReplayManagerService } from 'src/app/services/replay-manager.service';
import { ToolService } from 'src/app/services/tool.service';

import { ActorInfo } from 'src/app/interfaces/replay-info.interface';

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
    colorPick:  new FormControl<string>(''),
    colorText:  new FormControl<string>(''),
    imgUrl: new FormControl<string>(''),
  });


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
      this.formGroup.controls.colorPick.setValue(actor.color);
      this.formGroup.controls.colorText.setValue(actor.color);
      this.formGroup.controls.imgUrl.setValue(actor.imgUrl);
      this.errImgFlag = false;
    }
  }

  ChangeColorPick(): void {
    let colorCode = (this.formGroup.controls.colorPick.value || "#888888").toUpperCase();
    this.formGroup.controls.colorText.setValue(colorCode);
  }
  ChangeColorText(): void {
    let colorCode = (this.formGroup.controls.colorText.value || "#888888").toUpperCase();
    this.formGroup.controls.colorPick.setValue(colorCode);
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
    let color = this.formGroup.controls.colorText.value || "#888888";
    let imgUrl = this.formGroup.controls.imgUrl.value || "";
    
    const newValues = {
      name, color, imgUrl
    };
    
    this.rpManager.SetActorInfo(id, newValues);
    this.initList();
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
    //this.tool.PopupErrorNotify("此功能尚未實作")
    this.tool.PopupDialog();
  }

}

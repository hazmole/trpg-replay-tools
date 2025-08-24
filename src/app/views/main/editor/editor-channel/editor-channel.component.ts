import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ReplayManagerService } from 'src/app/services/replay-manager.service';
import { ToolService } from 'src/app/services/tool.service';

import { TwoColumnButtonEntry, TwoColumnClickBehavior } from 'src/app/views/shared/two-column/two-column-frame/two-column-frame.component';
import { EditorChannelDeleteComponent, DeleteChannelParam, DeleteChannelReturn } from './editor-channel-delete/editor-channel-delete.component';
import { Channel } from 'src/app/classes/channel-collection';

@Component({
  selector: 'app-editor-channel',
  templateUrl: './editor-channel.component.html',
  styleUrl: './editor-channel.component.css'
})
export class EditorChannelComponent implements OnInit{

  constructor(
    private rpManager: ReplayManagerService,
    private tool: ToolService,
  ) { }

  public formGroup = new FormGroup({
    chName:   new FormControl<string>(''),
    isMain:   new FormControl<string>('main'),
    isHidden: new FormControl<boolean>(false),
  });

  // Two-Colume Selection Frame
  public itemList: Array<TwoColumnButtonEntry> = [];
  public itemBehavior: TwoColumnClickBehavior;
  public itemSelecteID: string;
  
  public totalScriptNum = 0;

  ngOnInit(): void {
    this.itemBehavior = {
      add: () => { this.Add() },
      select: () => { this.Select() },
    };
    this.initList();
  }

  initList(): void {
    const channelColle = this.rpManager.GetChannelColle();
    this.itemList = channelColle.GetList().map((channel) => {
      return this.parseItem(channel);
    });
  }

  Save(): void {

    this.rpManager.GetChannelColle().Update(this.itemSelecteID, {
      name:     <string> this.formGroup.controls.chName.value,
      isMain:   (<string> this.formGroup.controls.isMain.value) === "main",
      isHidden: <boolean> this.formGroup.controls.isHidden.value,
    });
    this.initList();
    this.rpManager.Save();
    this.tool.PopupSuccessfulNotify("儲存成功！");
  }
  Select(): void {
    if(this.itemSelecteID !== "") {
      // update values
      const channel = this.rpManager.GetChannelColle().GetByID(this.itemSelecteID);
      this.formGroup.controls.chName.setValue(channel.name);
      this.formGroup.controls.isMain.setValue(channel.isMain? "main": "other");
      this.formGroup.controls.isHidden.setValue(channel.isHidden);

      this.totalScriptNum = this.rpManager.GetScriptArray().filter((script) => {
        return script.channelId === channel.id;
      }).length;
    }
  }
  Add(): void {
    this.rpManager.GetChannelColle().Add("", {
      id: "",
      name: "新創頻道",
      isMain: false,
      isHidden: false,
    }, true);
    this.initList();
  }
  Remove(): void {
    let id = this.itemSelecteID;
    
    if(this.totalScriptNum == 0) {
      this.tool.PopupConfirmMsgDialog("刪除頻道", "你確定要刪除這個頻道嗎？", () => {
        this._removeChannel(id);
      });
    } else if(this.itemList.length > 1) {
      const param: DeleteChannelParam = { channel_id: id };
      this.tool.PopupDialog(EditorChannelDeleteComponent, param, (retObj:DeleteChannelReturn)=>{
        if(retObj.is_delete_related) {
          this._deleteAllChatOfChannel(retObj.old_channel_id);
          this._removeChannel(id);
        } else {
          this._replaceChannelOfScripts(retObj.old_channel_id, retObj.new_channel_id);
          this._removeChannel(id);
        }
      });
    } else {
      this.tool.PopupErrorNotify("錯誤：你必須要有至少一個頻道！");
    }
  }
  private _deleteAllChatOfChannel(chID: string): void {
    const newArr = this.rpManager.GetScriptArray().filter((script) => (script.channelId !== chID));
    this.rpManager.SetScriptArray(newArr);
  }
  private _replaceChannelOfScripts(oldID: string, newID: string): void {
    this.rpManager.GetScriptArray().forEach((script) => {
      if(script.channelId === oldID)
        script.channelId = newID;
    });
  }
  private _removeChannel(chID: string): void {
    this.tool.PopupSuccessfulNotify("刪除成功！");
    this.rpManager.GetChannelColle().Remove(chID);
    this.itemSelecteID = "";
    this.initList();
  }
  

  getChID(): string {
    return this.itemSelecteID;
  }

  parseItem(item: Channel): TwoColumnButtonEntry {
    return { id:item.id, text:item.name };
  }
}

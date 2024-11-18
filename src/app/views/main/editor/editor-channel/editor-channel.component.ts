import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ChannelInfo } from 'src/app/interfaces/replay-info.interface';
import { ReplayManagerService } from 'src/app/services/replay-manager.service';
import { ToolService } from 'src/app/services/tool.service';

import { TwoColumnButtonEntry, TwoColumnClickBehavior } from 'src/app/views/shared/two-column/two-column-frame/two-column-frame.component';
import { EditorChannelDeleteComponent, DeleteChannelParam, DeleteChannelReturn } from './editor-channel-delete/editor-channel-delete.component';

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
    isMain:   new FormControl<string>("main"),
    isHidden: new FormControl<boolean>(false),
  });

  // Two-Colume Selection Frame
  public itemList: Array<TwoColumnButtonEntry> = [];
  public itemBehavior: TwoColumnClickBehavior;
  public itemSelecteID: number = -1;
  
  public totalScriptNum = 0;

  private channelMap: Record<number, ChannelInfo> = {};

  ngOnInit(): void {
    this.itemBehavior = {
      add: () => { this.Add() },
      select: () => { this.Select() },
    };
    this.initList();
  }
  initList(): void {
    this.channelMap = this.rpManager.GetChannelList();
    this.itemList = Object.values(this.channelMap).map(this.parseItem);
  }

  Save(): void {
    const newValues = { 
      name:     <string> this.formGroup.controls.chName.value,
      isMain:  (<string> this.formGroup.controls.isMain.value) == "main",
      isHidden: <boolean> this.formGroup.controls.isHidden.value,
    };
    this.rpManager.SetChannelInfo(this.itemSelecteID, newValues);
    this.initList();
    this.tool.PopupSuccessfulNotify("儲存成功！");
  }
  Select(): void {
    if(this.itemSelecteID == -1) return ;
    // update values
    let chObj = this.channelMap[this.itemSelecteID];
    this.formGroup.controls.chName.setValue(chObj.name);
    this.formGroup.controls.isMain.setValue(chObj.isMain? "main": "other");
    this.formGroup.controls.isHidden.setValue(chObj.isHidden);

    this.totalScriptNum = Object.values(this.rpManager.GetScriptEntryList())
      .filter((script) => script?.channelId === chObj.id).length;
    console.log(this.totalScriptNum);
  }
  Add(): void {
    let maxId = this.getMaxID();
    const newChannel:ChannelInfo = {
      id: (maxId+1),
      name: "新創頻道",
      isMain: false,
      isHidden: false,
    };

    this.rpManager.SetChannelInfo(newChannel.id, newChannel);
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
          this.rpManager.DeleteScriptByChannel(retObj.old_channel_id);
        } else {
          this._replaceChannelOfScripts(retObj.old_channel_id, retObj.new_channel_id);
          this._removeChannel(id);
        }
      });
    } else {
      this.tool.PopupErrorNotify("錯誤：你必須要有至少一個頻道！");
    }
  }
  private _replaceChannelOfScripts(oldID: number, newID: number): void {
    this.rpManager.GetScriptEntryList().forEach((entry) => {
      if(entry.channelId === oldID)
        entry.channelId = newID;
    })
  }
  private _removeChannel(chID: number): void {
    this.tool.PopupSuccessfulNotify("刪除成功！");
    this.rpManager.DeleteScriptByChannel(chID);
    this.rpManager.DeleteChannel(chID);
    this.itemSelecteID = -1;
    this.initList();
  }
  


  getMaxID(): number {
    let maxId = -1;
    Object.values(this.channelMap).forEach(item => {
      if(maxId < item.id) maxId = item.id;
    });
    return maxId;
  }
  getChID(): number {
    return this.itemSelecteID;
  }

  parseItem(item:ChannelInfo): TwoColumnButtonEntry {
    return { id:item.id, text:item.name };
  }
}

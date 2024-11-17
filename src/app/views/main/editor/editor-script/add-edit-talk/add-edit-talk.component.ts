import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogHeaderOptions } from 'src/app/interfaces/dialog-options.interface';
import { DialogFooterOptions } from 'src/app/interfaces/dialog-options.interface';

import { ReplayManagerService } from 'src/app/services/replay-manager.service';

import { ScriptEntry } from 'src/app/interfaces/replay-info.interface';
import { Mode, AddEditScriptParam, AddEditScriptReturn } from 'src/app/interfaces/add-edit-script-entry.interface';


@Component({
  selector: 'app-add-edit-talk',
  templateUrl: './add-edit-talk.component.html',
  styleUrl: './add-edit-talk.component.css'
})
export class AddEditTalkComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<AddEditTalkComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddEditScriptParam,
    private rpManager: ReplayManagerService,
  ){}

  headerOptions: DialogHeaderOptions = {
    close: { click: () => { this.onClose() } }
  };
  footerOptions: DialogFooterOptions = {
    close:   { click: () => { this.onClose() } },
    confirm: { 
      click: () => { this.onConfirm() }
    }
  };
  formGroup = new FormGroup({
    actorID: new FormControl<number>(0),
    channelID: new FormControl<number>(0),
    content: new FormControl<string>(""),
  });

  public mode: Mode = "add";
  public dialogTitle: string = "";
  public entryObj: ScriptEntry = {
    type: "talk",
    content: "",
  };

  actorOptionList:Array<ActorEntry> = [];
  channelOptionList:Array<ChannelEntry> = [];

  ngOnInit(): void {
    this.mode = this.data.mode;

    if(this.mode === "add") {
      this.dialogTitle = "新增對話";
    } else {
      this.dialogTitle = "編輯對話";
      this.formGroup.controls.actorID.setValue(this.data.entry?.actorId || 0);
      this.formGroup.controls.channelID.setValue(this.data.entry?.channelId || 0);
      this.formGroup.controls.content.setValue(this.parseHtml(this.data.entry?.content || ""));
    }

    //=========
    const actorList = this.rpManager.GetActorList();
    this.actorOptionList = Object.values(actorList)
      .map( actor => {
        return {
          text: `(ID:${actor.id}) ${actor.name}`,
          id: actor.id
        }
      });
    this.channelOptionList = Object.values(this.rpManager.GetChannelList())
      .map( channel => {
        return {
          text: channel.name,
          id: channel.id
        }
      });
  }

  parseHtml(content: string): string {
    return content.replace(/<br>/g, '\n');
  }
  restoreHtml(content: string): string {
    return content.replace(/\n/g, '<br>');
  }


  onClose(): void {
    this.dialogRef.close(null);
  }
  onConfirm(): void {
    this.entryObj.actorId = this.formGroup.controls.actorID.value || 0;
    this.entryObj.channelId = this.formGroup.controls.channelID.value || 0;
    this.entryObj.content = this.restoreHtml(this.formGroup.controls.content.value || "");

    let retObj: AddEditScriptReturn = {
      mode:  this.mode,
      entry: this.entryObj,
    };
    this.dialogRef.close(retObj);
  }
}


interface ActorEntry {
  text: string;
  id: number;
}
interface ChannelEntry {
  text: string;
  id: number;
}
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogHeaderOptions } from 'src/app/interfaces/dialog-options.interface';
import { DialogFooterOptions } from 'src/app/interfaces/dialog-options.interface';

import { ReplayManagerService } from 'src/app/services/replay-manager.service';

import { Mode, AddEditScriptParam, AddEditScriptReturn } from 'src/app/interfaces/add-edit-script-entry.interface';
import { ScriptEntry } from 'src/app/classes/script-entry';


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
    actorID: new FormControl<string>(""),
    channelID: new FormControl<string>(""),
    content: new FormControl<string>(""),
  });

  public mode: Mode = "add";
  public dialogTitle: string = "";
  public entryObj: ScriptEntry = {
    type: "chat",
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
      this.formGroup.controls.actorID.setValue(this.data.entry?.actorId || "");
      this.formGroup.controls.channelID.setValue(this.data.entry?.channelId || "");
      this.formGroup.controls.content.setValue(this.parseHtml(this.data.entry?.content || ""));
    }

    //=========
    this.actorOptionList = this.rpManager.GetActorColle().GetList().map(actor => {
        return {
          text: `(ID:${actor.id}) ${actor.name}`,
          id: actor.id
        }
      });
    this.channelOptionList = this.rpManager.GetChannelColle().GetList()
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
    this.entryObj.actorId = this.formGroup.controls.actorID.value || "";
    this.entryObj.channelId = this.formGroup.controls.channelID.value || "";
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
  id: string;
}
interface ChannelEntry {
  text: string;
  id: string;
}
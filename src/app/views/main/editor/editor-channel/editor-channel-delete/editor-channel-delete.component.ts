import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogHeaderOptions } from 'src/app/interfaces/dialog-options.interface';
import { DialogFooterOptions } from 'src/app/interfaces/dialog-options.interface';

import { ReplayManagerService } from 'src/app/services/replay-manager.service';

@Component({
  selector: 'app-editor-channel-delete',
  templateUrl: './editor-channel-delete.component.html',
  styleUrl: './editor-channel-delete.component.css'
})
export class EditorChannelDeleteComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<EditorChannelDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteChannelParam,
    private rpManager: ReplayManagerService,
  ){}

  headerOptions: DialogHeaderOptions = {
    close: { click: () => { this.onClose() } }
  };
  footerOptions: DialogFooterOptions = {
    close:   { click: () => { this.onClose() } },
    confirm: { click: () => { this.onConfirm() } }
  };

  public formGroup = new FormGroup({
    isDeleteRelatedScript: new FormControl<boolean>(true),
    newChannelID: new FormControl<number>(0),
  });

  private oldChannelID: number = -1;
  private oldChannelName: string = "";
  public optionList: Array<ChannelEntry> = [];

  ngOnInit(): void {
    const chList = this.rpManager.GetChannelList()

    this.oldChannelID = this.data.channel_id;
    this.oldChannelName = chList[this.data.channel_id].name;
        
    this.optionList = Object.values(chList)
      .filter( ch => ch.id != this.oldChannelID )
      .map( ch => {
        return {
          text: `(ID:${ch.id}) ${ch.name}`,
          id: ch.id
        }
      });
    this.formGroup.controls.newChannelID.setValue(this.optionList[0].id);
  }


  isChannelReplaced(): boolean {
    return this.formGroup.controls.isDeleteRelatedScript.value == false;
  }
  getOldChannelName(): string {
    return this.oldChannelName;
  }
  

  onClose(): void {
    this.dialogRef.close(null);
  }
  onConfirm(): void {
    this.dialogRef.close({
      old_actor_id: this.oldChannelID,
      new_actor_id: this.formGroup.controls.newChannelID.value,
    });
  }
}

interface ChannelEntry {
  text: string;
  id: number;
}
export interface DeleteChannelParam {
  channel_id: number;
}
export interface DeleteChannelReturn {
  is_delete_related: boolean;
  old_channel_id: number;
  new_channel_id: number;
}
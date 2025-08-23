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
    isDeleteRelatedScript: new FormControl<boolean>(false),
    newChannelID: new FormControl<string>(""),
  });

  private oldChannelID: string;
  private oldChannelName: string;
  public optionList: Array<ChannelEntry> = [];

  ngOnInit(): void {
    const channelID = this.data.channel_id;
    const chColle = this.rpManager.GetChannelColle()

    this.oldChannelID = this.data.channel_id;
    this.oldChannelName = chColle.GetByID(channelID).name;

    this.optionList = chColle.GetList()
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
      old_channel_id: this.oldChannelID,
      new_channel_id: this.formGroup.controls.newChannelID.value,
    });
  }
}

interface ChannelEntry {
  text: string;
  id: string;
}
export interface DeleteChannelParam {
  channel_id: string;
}
export interface DeleteChannelReturn {
  is_delete_related: boolean;
  old_channel_id: string;
  new_channel_id: string;
}
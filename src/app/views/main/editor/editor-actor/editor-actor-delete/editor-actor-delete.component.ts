import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogHeaderOptions } from 'src/app/interfaces/dialog-options.interface';
import { DialogFooterOptions } from 'src/app/interfaces/dialog-options.interface';

import { ReplayManagerService } from 'src/app/services/replay-manager.service';

@Component({
  selector: 'app-editor-actor-delete',
  templateUrl: './editor-actor-delete.component.html',
  styleUrl: './editor-actor-delete.component.css'
})
export class EditorActorDeleteComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<EditorActorDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteActorParam,
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
    newActorID: new FormControl<number>(0),
  });

  private oldActorID: number = -1;
  private oldActorName: string = "";
  public actorOptionList: Array<ActorEntry> = [];

  ngOnInit(): void {
    const actorList = this.rpManager.GetActorList()

    this.oldActorID = this.data.actor_id;
    this.oldActorName = actorList[this.data.actor_id].name;
        
    this.actorOptionList = Object.values(actorList)
      .filter( actor => actor.id != this.oldActorID )
      .map( actor => {
        return {
          text: `(ID:${actor.id}) ${actor.name}`,
          id: actor.id
        }
      });
    this.formGroup.controls.newActorID.setValue(this.actorOptionList[0].id);
  }


  getOldActorName(): string {
    return this.oldActorName;
  }


  onClose(): void {
    this.dialogRef.close(null);
  }
  onConfirm(): void {
    this.dialogRef.close({
      old_actor_id: this.oldActorID,
      new_actor_id: this.formGroup.controls.newActorID.value,
    });
  }
}


interface ActorEntry {
  text: string;
  id: number;
}

export interface DeleteActorParam {
  actor_id: number;
}
export interface DeleteActorReturn {
  old_actor_id: number;
  new_actor_id: number;
}
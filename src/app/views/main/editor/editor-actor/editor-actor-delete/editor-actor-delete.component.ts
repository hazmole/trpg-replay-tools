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
    isDeleteRelatedScript: new FormControl<boolean>(false),
    newActorID: new FormControl<string>(""),
  });

  private oldActorID: string;
  private oldActorName: string;
  public optionList: Array<ActorEntry> = [];

  ngOnInit(): void {
    const actorID = this.data.actor_id;
    const actorColle = this.rpManager.GetActorColle()

    this.oldActorID = actorID;
    this.oldActorName = actorColle.GetByID(actorID).name;

    this.optionList = actorColle.GetList()
      .filter( actor => actor.id != this.oldActorID )
      .map( actor => {
        return {
          text: `(ID:${actor.id}) ${actor.name}`,
          id: actor.id
        }
      });
    this.formGroup.controls.newActorID.setValue(this.optionList[0].id);
  }


  isActorReplaced(): boolean {
    return this.formGroup.controls.isDeleteRelatedScript.value == false;
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
  id: string;
}

export interface DeleteActorParam {
  actor_id: string;
}
export interface DeleteActorReturn {
  is_delete_related: boolean;
  old_actor_id: string;
  new_actor_id: string;
}
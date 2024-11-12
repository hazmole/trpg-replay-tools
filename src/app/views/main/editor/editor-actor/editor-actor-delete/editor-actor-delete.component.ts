import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogHeaderOptions } from 'src/app/interfaces/dialog-options.interface';
import { DialogFooterOptions } from 'src/app/interfaces/dialog-options.interface';

import { ReplayManagerService } from 'src/app/services/replay-manager.service';
import { ActorInfo } from 'src/app/interfaces/replay-info.interface';


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

  private oldActorID: number = -1;
  public actorOptionList: Array<any> = [];

  ngOnInit(): void {
    this.oldActorID = this.data.actor_id;
    
    let actorList = Object.values(this.rpManager.GetActorList());

    
    this.actorOptionList = actorList
      .filter( actor => actor.id != this.oldActorID )
      .map( actor => {
        return {
          text: `(ID:${actor.id}) ${actor.name}`,
          id: actor.id
        }
      });
  }





  onClose(): void {
    this.dialogRef.close(null);
  }
  onConfirm(): void {
    this.dialogRef.close({
      old_actor_id: this.oldActorID,
      new_actor_id: 2,
    });
  }
}


export interface DeleteActorParam {
  actor_id: number;
}
export interface DeleteActorReturn {
  old_actor_id: number;
  new_actor_id: number;
}
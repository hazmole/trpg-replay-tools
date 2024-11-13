import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogHeaderOptions } from 'src/app/interfaces/dialog-options.interface';
import { DialogFooterOptions } from 'src/app/interfaces/dialog-options.interface';

import { ScriptEntry } from 'src/app/interfaces/replay-info.interface';
import { Mode, AddEditScriptParam, AddEditScriptReturn } from 'src/app/interfaces/add-edit-script-entry.interface';


@Component({
  selector: 'app-add-edit-title',
  templateUrl: './add-edit-title.component.html',
  styleUrl: './add-edit-title.component.css'
})
export class AddEditTitleComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<AddEditTitleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddEditScriptParam,
  ){}

  headerOptions: DialogHeaderOptions = {
    close: { click: () => { this.onClose() } }
  };
  footerOptions: DialogFooterOptions = {
    close:   { click: () => { this.onClose() } },
    confirm: { 
      click: () => { this.onConfirm() },
      disabled: () => { return this.formGroup.invalid; }
    }
  };
  formGroup = new FormGroup({
    titleText: new FormControl<string>("", Validators.required),
  });


  public mode: Mode = "add";
  public dialogTitle: string = "";
  public entryObj: ScriptEntry = {
    type: "title",
    content: "",
  };

  ngOnInit(): void {
    this.mode = this.data.mode;

    if(this.mode === "add") {
      this.dialogTitle = "新增段落標題";
    } else {
      this.dialogTitle = "編輯段落標題";
      this.formGroup.controls.titleText.setValue(this.data.entry?.content || "");
    }
  }

  onClose(): void {
    this.dialogRef.close(null);
  }
  onConfirm(): void {
    this.entryObj.content = this.formGroup.controls.titleText.value || "";
    let retObj: AddEditScriptReturn = {
      mode:  this.mode,
      entry: this.entryObj,
    };
    this.dialogRef.close(retObj);
  }
}



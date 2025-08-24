import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogHeaderOptions } from 'src/app/interfaces/dialog-options.interface';
import { DialogFooterOptions } from 'src/app/interfaces/dialog-options.interface';


import { Mode, AddEditScriptParam, AddEditScriptReturn } from 'src/app/interfaces/add-edit-script-entry.interface';
import { ScriptEntry } from 'src/app/classes/script-entry';


@Component({
  selector: 'app-add-edit-image',
  templateUrl: './add-edit-image.component.html',
  styleUrl: './add-edit-image.component.css'
})
export class AddEditImageComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<AddEditImageComponent>,
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
    imgUrl: new FormControl<string>("", Validators.required),
  });

  public mode: Mode = "add";
  public dialogTitle: string = "";
  public entryObj: ScriptEntry = {
    type: "setBg",
    content: "",
  };

  public errImgFlag: boolean = false;

  ngOnInit(): void {
    this.mode = this.data.mode;

    if(this.mode === "add") {
      this.dialogTitle = "新增背景圖片";
    } else {
      this.dialogTitle = "編輯背景圖片";
      this.formGroup.controls.imgUrl.setValue(this.data.entry?.content || "");
    }
  }

  getImgUrl(): string {
    return this.formGroup.controls.imgUrl.value || "";
  }
  OnChangeImageUrl(): void {
    this.errImgFlag = false;
  }
  OnImageError(): void {
    this.errImgFlag = true;
  }

  
  onClose(): void {
    this.dialogRef.close(null);
  }
  onConfirm(): void {
    this.entryObj.content = this.formGroup.controls.imgUrl.value || "";
    let retObj: AddEditScriptReturn = {
      mode:  this.mode,
      entry: this.entryObj,
    };
    this.dialogRef.close(retObj);
  }
}

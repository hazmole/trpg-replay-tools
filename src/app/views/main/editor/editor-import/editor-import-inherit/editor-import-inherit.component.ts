import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogHeaderOptions } from 'src/app/interfaces/dialog-options.interface';
import { DialogFooterOptions } from 'src/app/interfaces/dialog-options.interface';


@Component({
  selector: 'app-editor-import-inherit',
  templateUrl: './editor-import-inherit.component.html',
  styleUrl: './editor-import-inherit.component.css'
})
export class EditorImportInheritComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<EditorImportInheritComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}

  headerOptions: DialogHeaderOptions = {
    close: {  click: () => { this.onClose() } }
  };
  footerOptions: DialogFooterOptions = {
    close:   {
      click: () => { this.onClose() }
    },
    confirm: { 
      click: () => { this.onConfirm() },
      disabled: () => { return this.formGroup.invalid; }
    }
  };

  formGroup = new FormGroup({
    isInheritActor: new FormControl<boolean>(true),
    isInheritTheme: new FormControl<boolean>(true),
  });

  ngOnInit(): void {
  }


  onClose(): void {
    this.dialogRef.close(null);
  }
  onConfirm(): void {
    let retObj: ImportInheritReturn = {
      isInheritActor: this.formGroup.controls.isInheritActor.value || false,
      isInheritTheme: this.formGroup.controls.isInheritTheme.value || false,
    };
    this.dialogRef.close(retObj);
  }
}

export interface ImportInheritReturn {
  isInheritActor: boolean;
  isInheritTheme: boolean;
}
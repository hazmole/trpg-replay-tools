import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogHeaderOptions } from 'src/app/interfaces/dialog-options.interface';
import { DialogFooterOptions } from 'src/app/interfaces/dialog-options.interface';

@Component({
  selector: 'app-popup-dialog',
  templateUrl: './popup-dialog.component.html',
  styleUrls: ['./popup-dialog.component.css']
})
export class PopupDialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<PopupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}

  headerOptions: DialogHeaderOptions = {
    close: { click: () => { this.onClose() } }
  };
  footerOptions: DialogFooterOptions = {
    close:   { click: () => { this.onClose() } },
    confirm: { click: () => { this.onConfirm() } }
  };


  public message: string = "";
  public title: string = "";

  ngOnInit(): void {
      this.message = this.data.message;
      this.title  = this.data.title;
  }

  onClose(): void {
    this.dialogRef.close(false);
  }
  onConfirm(): void {
    this.dialogRef.close(true);
  }

}

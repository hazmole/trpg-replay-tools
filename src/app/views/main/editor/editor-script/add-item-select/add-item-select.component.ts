import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogHeaderOptions } from 'src/app/interfaces/dialog-options.interface';
import { DialogFooterOptions } from 'src/app/interfaces/dialog-options.interface';


@Component({
  selector: 'app-add-item-select',
  templateUrl: './add-item-select.component.html',
  styleUrl: './add-item-select.component.css'
})
export class AddItemSelectComponent {
  constructor(
    private dialogRef: MatDialogRef<AddItemSelectComponent>,
  ){}

  headerOptions: DialogHeaderOptions = {
    close: { click: () => { this.onClose() } }
  };
  footerOptions: DialogFooterOptions = {
    close:   { click: () => { this.onClose() } },
  };

  onClose(): void {
    this.dialogRef.close(null);
  }
  apply(type:string): void {
    this.dialogRef.close(type);
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogButtonOptions, DialogFooterOptions } from 'src/app/interfaces/dialog-options.interface';

@Component({
  selector: 'app-dialog-footer',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './dialog-footer.component.html',
  styleUrl: './dialog-footer.component.css'
})
export class DialogFooterComponent implements OnInit {
  @Input() options: (DialogFooterOptions | null) = null;

  public isShowConform: boolean = false;
  public confirmText: string = "確認";
  public cancelText: string = "取消";

  closeObj: DialogButtonOptions = { click: null };
  confirmObj: DialogButtonOptions = { click: null };

  ngOnInit(): void {
    if(this.options?.close)   this.closeObj = this.options.close;
    if(this.options?.confirm) this.confirmObj = this.options.confirm;

    // Set Flag
    this.isShowConform = (this.confirmObj.click != null);
    
    // Set Button Text
    if(this.closeObj.text)   this.cancelText  = this.closeObj.text;
    if(this.confirmObj.text) this.confirmText = this.confirmObj.text;


  }


  isCloseDisabled(): boolean {
    switch(typeof this.closeObj.disabled) {
      case "function":  return this.closeObj.disabled();
      case "boolean":   return this.closeObj.disabled;
      default:          return false;
    }
  }
  isConfirmDisabled(): boolean {
    switch(typeof this.confirmObj.disabled) {
      case "function":  return this.confirmObj.disabled();
      case "boolean":   return this.confirmObj.disabled;
      default:          return false;
    }
  }

  onClose(e:Event): void {
    if(this.isCloseDisabled()) return ;
    if(this.options?.close?.click) this.options.close.click(e);
  }
  onConfirm(e:Event): void {
    if(this.isConfirmDisabled()) return ;
    if(this.options?.confirm?.click) this.options.confirm.click(e);
  }

}



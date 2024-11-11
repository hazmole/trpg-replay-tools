import { Component, Input, ElementRef } from '@angular/core';

@Component({
  selector: 'app-popup-dialog',
  templateUrl: './popup-dialog.component.html',
  styleUrls: ['./popup-dialog.component.css']
})
export class PopupDialogComponent {
  @Input() title: string = "";
  @Input() message: string = "";
  @Input() comfirmCallback: (Function|null) = null;

  constructor(private host: ElementRef<HTMLElement>){}

  confirm(): void {
    this.host.nativeElement.remove();
    if(this.comfirmCallback != null) {
      this.comfirmCallback();
    }
  }

  close(): void {
    this.host.nativeElement.remove();
  }
}

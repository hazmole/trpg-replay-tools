import { Injectable } from '@angular/core';
import { ApplicationRef } from '@angular/core';
import { AppComponent } from '../app.component';

import { NotifyMessageComponent } from '../views/shared/partial/notify-message/notify-message.component';
import { PopupDialogComponent } from '../views/shared/partial/popup-dialog/popup-dialog.component';


@Injectable({
  providedIn: 'root'
})
export class ToolService {

  constructor(private appRef: ApplicationRef) { }



  // Confirm Dialog
  public PopupDialog(message: string, callback: Function) {
    const viewRef = (this.appRef.components[0].instance as AppComponent).viewRef;
    const comp = viewRef.createComponent(PopupDialogComponent);
    comp.setInput("title", "警告");
    comp.setInput("message", message);
    comp.setInput("comfirmCallback", callback);

  }



  // Notify
  public PopupSuccessfulNotify(msg: string) {
    this.PopupNotifyMsg("success", msg);
  }
  public PopupWarningNotify(msg: string) {
    this.PopupNotifyMsg("warning", msg);
  }
  public PopupErrorNotify(msg: string) {
    this.PopupNotifyMsg("error", msg);
  }
  public PopupNotifyMsg(level: string, msg: string) {
    const viewRef = (this.appRef.components[0].instance as AppComponent).viewRef;

    const comp = viewRef.createComponent(NotifyMessageComponent);
    comp.setInput("level", level);
    comp.setInput("message", msg);

    setTimeout(() => {
      comp.instance.close();
    }, 2000);
  }
}

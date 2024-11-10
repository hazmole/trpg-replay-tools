import { Injectable } from '@angular/core';
import { NotifyMessageComponent } from '../views/shared/partial/notify-message/notify-message.component';
import { ApplicationRef } from '@angular/core';
import { AppComponent } from '../app.component';

@Injectable({
  providedIn: 'root'
})
export class ToolService {

  constructor(private appRef: ApplicationRef) { }



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

    const msgBoxComp = viewRef.createComponent(NotifyMessageComponent);
    msgBoxComp.setInput("level", level);
    msgBoxComp.setInput("message", msg);

    setTimeout(() => {
      msgBoxComp.instance.close();
    }, 2000);
  }
}

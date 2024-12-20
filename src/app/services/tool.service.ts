import { Injectable } from '@angular/core';
import { ApplicationRef } from '@angular/core';
import { AppComponent } from '../app.component';
import { MatDialog } from '@angular/material/dialog';

import { NotifyMessageComponent } from '../views/shared/partial/notify-message/notify-message.component';
import { PopupDialogComponent } from '../views/shared/partial/popup-dialog/popup-dialog.component';


@Injectable({
  providedIn: 'root'
})
export class ToolService {

  constructor(
    private appRef: ApplicationRef,
    private matDialog: MatDialog,
  ) { }


  // General Function for MatDialog
  public PopupDialog(comp: any, param:any, callback: Function) {
    this.matDialog.open(comp, {
      data: param,
      disableClose: true,
    })
    .afterClosed()
    .subscribe((retObj:any | null) => {
      if(retObj==null) return ;
      if(callback!=null) callback(retObj);
    });

  }

  // Confirm Dialog
  public PopupConfirmMsgDialog(title: string, message: string, successCB: Function, errorCB?: Function) {
    const dialogRef = this.matDialog.open(PopupDialogComponent, {
      data: {
        title: title,
        message: message,
      },
      disableClose: true,
      autoFocus: false,
    })
    dialogRef.afterClosed().subscribe((isConfirm) => {
      if(isConfirm){ successCB() }
      else if(errorCB){ errorCB() }
    });
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

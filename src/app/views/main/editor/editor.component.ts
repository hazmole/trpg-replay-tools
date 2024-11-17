import { Component, OnInit } from '@angular/core';
import { TabControl, TabKey } from 'src/app/interfaces/tab-control.interface';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  public navbarArr:Array<TabKey> = [ "import", "config", "actors", "channel", "scripts", "export" ];
  public currentTabKey:string = "";
  public control:TabControl = {
    Goto: (key:TabKey) => { this.clickTab(key); }
  };

  ngOnInit(): void {
    this.currentTabKey = this.navbarArr[0];
  }

  public clickTab(newTab:string) {
    this.currentTabKey = newTab;
  }

}
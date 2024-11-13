import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  public navbarArr:Array<string> = [ "import", "export", "actors", "scripts" ];
  public currentTabKey:string = "";
  public control:any = {
    goto: (tab:string) => { this.clickTab(tab); }
  };

  ngOnInit(): void {
    this.currentTabKey = this.navbarArr[0];
  }

  public clickTab(newTab:string) {
    this.currentTabKey = newTab;
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  public navbarArr:Array<string> = [ "player", "settings" ];
  public currentTabKey:string = "";

  ngOnInit(): void {
    this.currentTabKey = this.navbarArr[0];
  }

  public clickTab(newTab:string) {
    this.currentTabKey = newTab;
  }

}

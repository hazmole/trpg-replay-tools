import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-panel-nav-button',
  templateUrl: './panel-nav-button.component.html',
  styleUrls: ['./panel-nav-button.component.css']
})
export class PanelNavButtonComponent implements OnInit {
  @Input() key: string = "";
  @Input() isActive: boolean = false;

  public text: string = "";
  public imgUrl: string = "";

  private btnCfgMap: Record<string, btnInfo> = {
    import: {
      text: "匯入",
      imgUrl: "assets/images/import-icon.png"
    },
    export: {
      text: "輸出",
      imgUrl: "assets/images/load.png"
    },
    config: {
      text: "設定",
      imgUrl: "assets/images/cog.png"
    },
    actors: {
      text: "角色設定",
      imgUrl: "assets/images/mona-lisa.png"
    },
    scripts: {
      text: "團錄編輯",
      imgUrl: "assets/images/open-book.png"
    },
    player: {
      text: "播放器",
      imgUrl: "assets/images/play-button.png"
    },
    settings: {
      text: "設定",
      imgUrl: "assets/images/cog.png"
    },
    channel: {
      text: "頻道編輯",
      imgUrl: "assets/images/tv.svg"
    },
  };


  ngOnInit(): void {
    let infoObj = this.btnCfgMap[this.key];
    if (infoObj != null) {
      this.text = infoObj.text;
      this.imgUrl = infoObj.imgUrl;
    } else {
      this.text = "？？？";
      this.imgUrl = "assets/images/help.png";
    }
  }
}

interface btnInfo {
  text: string;
  imgUrl: string;
}
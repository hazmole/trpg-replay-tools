import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.css'
})
export class IconButtonComponent implements OnInit {
  @Input() type: string = "";
  @Input() text: string = "";

  public imgUrl: string = "";
  public label: string = "";

  ngOnInit(): void {
    
    switch(this.type) {
      case "edit":
        this.label = "編輯";
        this.imgUrl = 'assets/images/scroll-quill.png';
        break;
      case "delete":
        this.label = "刪除";
        this.imgUrl = 'assets/images/cross.png';
        break;
      case "undo":
        this.label = "復原";
        this.imgUrl = 'assets/images/undo.png';
        break;
      case "redo":
        this.label = "重作";
        this.imgUrl = 'assets/images/redo.png';
        break;
      case "save":
        this.label = "儲存";
        this.imgUrl = 'assets/images/save.svg';
        break;
    }
  }

  isShowText(): boolean {
    return this.text.length > 0;
  }
}
